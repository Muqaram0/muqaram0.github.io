---
title: "Pandora"
date: 2026-02-09
draft: false
description: "HackTheBox Pandora writeup"
tags: ["hackthebox", "htb", "linux", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Pandora

## Overview

- **OS:** Linux
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

snmpwalk for creds, escalated with hidden site and known explot.

## Loot

| **Takeaways** |  |
| --- | --- |
| **Category** | **Details** |
| Usernames+Passwords | daniel:HotelBabylon23 |
| Hashes |  |

## Enumeration
- **nmap**

{{< figure src="image 344.png" >}}

- **80**

{{< figure src="image 345.png" >}}

- **161**

{{< figure src="image 346.png" >}}

## Exploitation

we ssh into the server with these creds as daniel, lets try privesc with linpeas and see if there is anything interesting.

{{< figure src="image 347.png" >}}

interesting we can try this

{{< figure src="image 348.png" >}}

nevermind it says starting from 1.9.14 so we can move on

{{< figure src="image 349.png" >}}

there seems to be no file so this cant be it either 

{{< figure src="image 350.png" >}}

lets check our linepas result again

{{< figure src="image 351.png" >}}

interesting, mysql is running?

{{< figure src="image 352.png" >}}

mysql is definetely running

{{< figure src="image 353.png" >}}

hmm lets check the pandora.conf file out

{{< figure src="image 354.png" >}}

there seems to be somethign running locally?

{{< figure src="image 355.png" >}}

lets check the sites conf file if there is anything we missed

{{< figure src="image 356.png" >}}

there is a site that is being hosted locally with the name pandora.panda.htb and its under matt, this is interesting lets add it to our hosts file and do some port forwarding 

on portforwarding the traffic we get this

{{< figure src="image 357.png" >}}

BOOM now lets enumerate

{{< figure src="image 358.png" >}}

on searching this version number we get this

Authenticated RCE

[Pandora FMS v7.0NG.742 - Remote Code Execution (RCE) (Authenticated)](https://www.exploit-db.com/exploits/50961)

there is also this

[blog.sonarsource.com/pandora-fms-742-critical-code-vulnerabilities-explained](http://blog.sonarsource.com/pandora-fms-742-critical-code-vulnerabilities-explained)

used a aunauthenticated sql exploit to get access as matt

{{< figure src="image 359.png" >}}

[Pandora_v7.0NG.742_exploit_unauthenticated/sqlpwn.py at master · shyam0904a/Pandora_v7.0NG.742_exploit_unauthenticated](https://github.com/shyam0904a/Pandora_v7.0NG.742_exploit_unauthenticated/blob/master/sqlpwn.py)

{{< figure src="image 360.png" >}}

Reading the config file gives us those credentials

found a MD5 hash on one of the tables, for matt

lets crack it aand it doesnt work

wait why do even have to do that in the first place, we can just use the cmdline we got from earlier to execute with python3 a revshell

annnd we have our shell as matt

{{< figure src="image 361.png" >}}

{{< figure src="image 362.png" >}}

we know that tar is being invoke w root, so lets modify it nd use our tar as the path to it is not absolute

```
    matt@pandora:/tmp$ touch tar
    matt@pandora:/tmp$ echo "/bin/sh" > tar
    matt@pandora:/tmp$ chmod +x tar
    matt@pandora:/tmp$ PATH=/tmp:$PATH
    matt@pandora:/tmp$ pandora_backup
    PandoraFMS Backup Utility
    Now attempting to backup PandoraFMS client
    $ whoami
    matt
```

this doesn’t work, i gave up nw and looked at 0xdfs writeup who explained why this didnt work, apparently it works if we ssh as matt and run it again so lets try that

{{< figure src="image 363.png" >}}
