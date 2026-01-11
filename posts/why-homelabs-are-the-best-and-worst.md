---
date: 2026-01-11
title: Why homelabs are the best and worst
slug: why-homelabs-are-the-best-and-worst
description: Building a homelab has been incredibly rewarding, until it isn't
wip: true
tags:
  - homelab
  - technology
  - curiosity
---

## Whats a homelab?

Homelabs started out as a means of experimenting at home with different servers, networking stacks, and more without the pressures of taking down your companies product.

Slowly it evolved into "Homeproduction" where critical parts of your (or my) life usually "need" it. 

## The best parts

Being able to build freely and experiement is very rewarding. You can treat it like a sandbox or a full production environment.

I like to freeball it. Some docs here or there, mostly declarative and GitOps but still some clickops hiding in the corners. Probably not the best approach, but it avoids  the worst parts of needing to treat it like a job.

## The worst parts

Now it's 2AM after a long day at work. Accidentilly caused a production issue (different story) and now I'm ready to go to bed. 

Lay down. Press the nighttime automation on my phones home page and .... nothing happens.

I have a Home Assistant automation to turn off every light, make sure all the doors are closed, the fan is on, etc. It's handy and all of it can be done by hand. It's just more conveneient this way when it works.

Debugging why my HA VM died that late wasn't quite on my todo list. I could've turned things off by hand but meh - I'm up lets go fix it.

This type of issue is very rare but annoying when it happens. It reveals you don't treat it like a real production environment but still use it like one. No alerts to tell you it happened, no high availability to fail over, no nothing.

I live alone, no partner or kids to leverage the infra so it really only affects me. If I were to live with others I can't imagine I'd be running Home Assistant like this.

## How to avoid

You should think about failure modes. Whether you're playing around in your homelab sandbox or buildling scalable products for millions - the failure modes are going to happen. In the homelab case, just think about em. Know what to expect and sometimes you're okay with the risk of it breaking at 2AM. If you're not, then you either shouldn't host that or need to instrument around this.

## Why do it anyways

I still find my homelab one of the most rewarding journies of the past 3 years. I learned Kubernetes on it, Infrastructure as Code, and more. It bled into my day job where I picked up the new infra stack very quickly to become a critical SME within my org on it.

There are many benefits to being a curious engineer. Just don't be surprised when your things break at home too.
