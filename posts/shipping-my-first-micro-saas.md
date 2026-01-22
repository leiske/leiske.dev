---
date: 2026-01-21
title: Shipping my first micro-saas
slug: shipping-my-first-micro-saas
description: Experience going through a full micro-saas launch for the first time
wip: true
tags:
  - saas
  - shipping
  - learning
---

# I've never shipped a product solo end to end

After writing code for >16 years it sounds crazy to say, but I haven't actually had solo projects go through to completion.

Sure, at work I've been a primary contributor of things here and there but typically someone else has touched at least one piece or helped me get it to the finish line.

One of my goals this year (2026) is to make $1 online, somehow. So lets see what these micro-saas things are all about.

## Expectations

They're on the floor! There is no expectation here. I do not, in my heart of hearts, believe this first guy will make any money or even get any visitors.

But that's okay, because I need to start somewhere and just start accumulating my learnings.

## What is it?

SocialMockups! A simple site to build X post mockups - useful for pitch decks, launch pages, marketing materials, and more.

It's a pretty simple idea and only took about a week of real effort to piece together.

You can check it out here: https://socialmockups.com

## Overall experience

It's been fun shifting mindsets from an enterprise big-tech engineer to a more scrappy indie hacker vibe. Lots of opportunity to overengineer and have some fun doing what I normally do.
But that doesn't ship products quickly to validate markets and learn distribution and go through the motions of a ProductHunt launch.

In order to see what it's all about I needed to ruthlessly avoid my instincts to build for scale, think ahead, and more. Just rip out everything. All of it can be deleted. Scaling is a luxury. It means you have users, which this won't have.

### Tech Stack

I love toys and playing with toys and trying new toys. So I feel like I needed to pick something I wouldn't fall out of love with in 3 years when I'm ideally still kicking and shipping like this.

Opted for Tanstack Start + React + Tailwind + Shadcn. Yeah yeah, very generic. I agree. But I ship React at my day job all day every day so it is within my realm of expertise and I can move much faster.

Hosting on Cloudflare Workers, using Cloudflare KV + Analytics Engine. Stripe for payments. Satorio for rendering HTML + CSS as SVGS and then resvg to get it back to PNG for export.


## Outcomes

Whether I get 0 page clicks, or 1, I'd say this has been a success for me. I've messed with Stripe integrations, launch and marketing materials for an application, and got my first taste of a micro-saas website.

If you need to generate some good looking X mockups, you should check out [SocialMockups](https://socialmockups.com).
