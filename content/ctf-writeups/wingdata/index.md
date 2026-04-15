---
title: "WingData"
date: 2026-03-09
draft: false
description: "HackTheBox WingData writeup"
tags: ["hackthebox", "htb", "linux", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# WingData

## Overview

- **OS:** Linux
- **IP:** 10.129.244.106
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

season.

## Loot

| Loot |  |
| --- | --- |
| **Category** | **Details** |
| Usernames |  |
| Passwords |  |
| Usernames+Passwords |  |
| Hashes |  |
| Service Versions |  |

## Enumeration

## Nmap

```
Host is up (0.11s latency).
Not shown: 998 filtered tcp ports (no-response)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.2p1 Debian 2+deb12u7 (protocol 2.0)
| ssh-hostkey: 
|   256 a1:fa:95:8b:d7:56:03:85:e4:45:c9:c7:1e:ba:28:3b (ECDSA)
|_  256 9c:ba:21:1a:97:2f:3a:64:73:c1:4c:1d:ce:65:7a:2f (ED25519)
**80/tcp open  http    Apache httpd 2.4.66
|_http-title: Did not follow redirect to http://wingdata.htb/**
|_http-server-header: Apache/2.4.66 (Debian)
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose|router
Running (JUST GUESSING): Linux 4.X|5.X|2.6.X|3.X (97%), MikroTik RouterOS 7.X (95%)
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3 cpe:/o:linux:linux_kernel:2.6 cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:6.0
Aggressive OS guesses: Linux 4.15 - 5.19 (97%), Linux 5.0 - 5.14 (97%), MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3) (95%), Linux 2.6.32 - 3.13 (91%), Linux 3.10 - 4.11 (91%), Linux 3.2 - 4.14 (91%), Linux 3.4 - 3.10 (91%), Linux 2.6.32 - 3.10 (91%), Linux 4.19 - 5.15 (91%), Linux 4.15 (90%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 2 hops
Service Info: Host: localhost; OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 80/tcp)
HOP RTT       ADDRESS
1   104.67 ms 10.10.14.1
2   104.69 ms 10.129.244.106

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 17.30 seconds
                                                                                              
```

## Dirbusting

```

```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

lets add this to our hosts

{{< figure src="image 588.png" >}}

## ftp

I validated this step using the evidence below before moving forward in the chain.

{{< figure src="image 589.png" >}}

## Exploitation

Wing FTP Server 7.4.3 - Unauthenticated Remote Code Execution (RCE)

[https://www.exploit-db.com/exploits/52347](https://www.exploit-db.com/exploits/52347)

when trying to revshell thru this it keep dying so lets use this other poc

[https://github.com/estebanzarate/CVE-2025-47812-Wing-FTP-Server-7.4.3-Unauthenticated-RCE-PoC](https://github.com/estebanzarate/CVE-2025-47812-Wing-FTP-Server-7.4.3-Unauthenticated-RCE-PoC)

{{< figure src="image 590.png" >}}

using nc we were able to change our shell

{{< figure src="image 591.png" >}}

```
IN_ACCOUNTS Description="Wing FTP Server Admin Accounts">
    <ADMIN>
        <Admin_Name>admin</Admin_Name>
        <Password>a8339f8e4465a9c47158394d8efe7cc45a5f361ab983844c8562bef2193bafba</Password>
        <Type>0</Type>
        <Readonly>0</Readonly>

```

```
ServerPassword>2D35A8D420A697203D7C554A678F8119</ServerPassword>

```

lets check this out

https://www.hooperlabs.xyz/disclosures/cve-2020-9470.php

{{< figure src="image 592.png" >}}

hmm lets see if we grab anything interesting from linpeas output

```
/opt/wftpserver/Data/1/groups
/opt/wftpserver/Data/1/portlistener.xml
/opt/wftpserver/Data/1/settings.xml
/opt/wftpserver/Data/1/users
/opt/wftpserver/Data/1/users/anonymous.xml
/opt/wftpserver/Data/1/users/john.xml
/opt/wftpserver/Data/1/users/maria.xml
/opt/wftpserver/Data/1/users/steve.xml
**/opt/wftpserver/Data/1/users/wacky.xml --> wacky is another user on this machine 

opt/wftpserver/Log/Admin
/opt/wftpserver/Log/Admin/Admin-2025-11-2.log
/opt/wftpserver/Log/Admin/Admin-2025-11-3.log
/opt/wftpserver/Log/Admin/Admin-2026-1-12.log
/opt/wftpserver/Log/Admin/Admin-2026-1-14.log
/opt/wftpserver/Log/Admin/Admin-2026-1-20.log

/opt/wftpserver/Log/Domains/1/2026-3-9.log
/opt/wftpserver/Log/Domains/1/2026-2-9.log.zip
/opt/wftpserver/Log/System/System-2026-2-9.log
/opt/wftpserver/Log/System/System-2026-3-9.log
/tmp/linpeas.sh**

```

```
anony:  d67f86152e5c4df1b0ac4a18d3ca4a89c1b12e6b748ed71d01aeb92341927bca
john: c1f14672feec3bba27231048271fcdcddeb9d75ef79f6889139aa78c9d398f10
maria: a70221f33a51dca76dfd46c17ab17116a97823caf40aeecfbc611cae47421b03
steve: 5916c7481fa2f20bd86f4bdb900f0342359ec19a77b7e3ae118f3b5d0d3334ca
wacky: 32940defd3c3ef70a2dd44a5301ff984c4742f0baae76ff5b8783994f8a503ca
```

on cracking the hash with WingFTP as the salt

!#7Blushing^*Bride5

we get this as the password

Password & Security" settings to harden the hashing process.
Variable Salt (%Name): The system allows the use of the variable %Name as a salt, which dynamically replaces the salt with the specific username for each user.
Default Salt Behavior: In some contexts, particularly for administrative users, a default salt (e.g., "WingFTP") may be used, resulting in hashes like SHA256(Password+"WingFTP").
Storage: The hashed passwords (often SHA-256) are typically stored in XML configuration files.

lets get a ssh shell now

{{< figure src="image 593.png" >}}

```
#!/usr/bin/env python3
import tarfile
import os
import sys
import re
import argparse

BACKUP_BASE_DIR = "/opt/backup_clients/backups"
STAGING_BASE = "/opt/backup_clients/restored_backups"

def validate_backup_name(filename):
    if not re.fullmatch(r"^backup_\d+\.tar$", filename):
        return False
    client_id = filename.split('_')[1].rstrip('.tar')
    return client_id.isdigit() and client_id != "0"

def validate_restore_tag(tag):
    return bool(re.fullmatch(r"^[a-zA-Z0-9_]{1,24}$", tag))

def main():
    parser = argparse.ArgumentParser(
        description="Restore client configuration from a validated backup tarball.",
        epilog="Example: sudo %(prog)s -b backup_1001.tar -r restore_john"
    )
    parser.add_argument(
        "-b", "--backup",
        required=True,
        help="Backup filename (must be in /home/wacky/backup_clients/ and match backup_<client_id>.tar, "
             "where <client_id> is a positive integer, e.g., backup_1001.tar)"
    )
    parser.add_argument(
        "-r", "--restore-dir",
        required=True,
        help="Staging directory name for the restore operation. "
             "Must follow the format: restore_<client_user> (e.g., restore_john). "
             "Only alphanumeric characters and underscores are allowed in the <client_user> part (1–24 characters)."
    )

    args = parser.parse_args()

    if not validate_backup_name(args.backup):
        print("[!] Invalid backup name. Expected format: backup_<client_id>.tar (e.g., backup_1001.tar)", file=sys.stderr)
        sys.exit(1)

    backup_path = os.path.join(BACKUP_BASE_DIR, args.backup)
    if not os.path.isfile(backup_path):
        print(f"[!] Backup file not found: {backup_path}", file=sys.stderr)
        sys.exit(1)

    if not args.restore_dir.startswith("restore_"):
        print("[!] --restore-dir must start with 'restore_'", file=sys.stderr)
        sys.exit(1)

    tag = args.restore_dir[8:]
    if not tag:
        print("[!] --restore-dir must include a non-empty tag after 'restore_'", file=sys.stderr)
        sys.exit(1)

    if not validate_restore_tag(tag):
        print("[!] Restore tag must be 1–24 characters long and contain only letters, digits, or underscores", file=sys.stderr)
        sys.exit(1)

    staging_dir = os.path.join(STAGING_BASE, args.restore_dir)
    print(f"[+] Backup: {args.backup}")
    print(f"[+] Staging directory: {staging_dir}")

    os.makedirs(staging_dir, exist_ok=True)

    try:
        with tarfile.open(backup_path, "r") as tar:
            tar.extractall(path=staging_dir, filter="data")
        print(f"[+] Extraction completed in {staging_dir}")
    except (tarfile.TarError, OSError, Exception) as e:
        print(f"[!] Error during extraction: {e}", file=sys.stderr)
        sys.exit(2)

if __name__ == "__main__":
    main()

```

{{< figure src="image 594.png" >}}

[https://github.com/AzureADTrent/CVE-2025-4517-POC-HTB-WingData](https://github.com/AzureADTrent/CVE-2025-4517-POC-HTB-WingData)
