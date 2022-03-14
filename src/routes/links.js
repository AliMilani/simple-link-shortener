const { Link, validate } = require("../models/link");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
    const links = await Link.find().select("-__v");
    res.send(links);
});

//post
router.post("/", async (req, res) => {
    //validate
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check duplicate slug
    if (req.body.slug) {
        let slugId = await Link.findOne({ slug: req.body.slug });
        if (slugId) return res.status(400).send("Slug already exists.");
    }

    //create new link
    let link = new Link({
        url: req.body.url,
        slug: req.body.slug,
        advancedSettings: req.body.advancedSettings,
    });

    link = await link.save();

    link = _.pick(link, ["_id", "url", "slug", "advancedSettings"]);
    link.advancedSettings = _.omit(link.advancedSettings, ["password"]);

    res.send(link);
});

router.put("/:id", async (req, res) => {
    //validate
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //if slug is changed, check if slug is unique
    if (req.body.slug) {
        sameSlug = await Link.findOne({ slug: req.body.slug });
        if (sameSlug && sameSlug._id != req.params.id)
            return res.status(400).send("Slug already exists.");
    }

    //if password is changed, hash it
    if (_.has(req.body, "advancedSettings.password")) {
        req.body.advancedSettings.password = await bcrypt.hash(
            req.body.advancedSettings.password,
            10
        );
    }

    //update link
    let link = await Link.findByIdAndUpdate(
        req.params.id,
        {
            url: req.body.url,
            slug: req.body.slug,
            advancedSettings: req.body.advancedSettings,
        },
        { new: true }
    );

    link = _.pick(link, ["_id", "url", "slug", "advancedSettings"]);
    link.advancedSettings = _.omit(link.advancedSettings, ["password"]);

    res.send(link);
});

router.delete("/:id", async (req, res) => {
    let link = await Link.findByIdAndRemove(req.params.id);
    if (!link) return res.status(404).send("Link not found.");
    res.send(link);
});

module.exports = router;
