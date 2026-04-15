---
title: "Cronos"
date: 2024-07-28
draft: false
description: "HackTheBox Cronos writeup"
tags: ["hackthebox", "htb", "linux", "medium"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Cronos

## Overview

- **OS:** Linux
- **IP:** 10.10.10.13
- **Difficulty:** Medium
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

learnt to perform dns enumeration , learnt how to use sql injection payloads , used lin peas to find a cron job running , ran a php rev shell through the cron job and pwned box CronOS.

## Enumeration


nmap results 

{{< figure src="image 1179.png" >}}

ok so we can see that there is dns-nsid

lets perform dns enum with ns lookup

dns enum

{{< figure src="image 1180.png" >}}

We will now check for zone transfer using DIG command. DNS zone transfer, also known as DNS query type AXFR, is a process by which a DNS server passes a copy of part of its database to another DNS server. The portion of the database that is replicated is known as a zone.

USAGE- dig axfr @<DNS_IP> <DOMAIN>

{{< figure src="image 1181.png" >}}

lets add these to our hosts file 

{{< figure src="image 1182.png" >}}

cronos and www.cronos

{{< figure src="image 1183.png" >}}

ns1.cronos.htb

{{< figure src="image 1184.png" >}}

admin.cronos.htb

{{< figure src="image 1185.png" >}}

dirbusting

{{< figure src="image 1186.png" >}}

{{< figure src="image 1187.png" >}}

config.php

{{< figure src="image 1188.png" >}}


## Vulnerabilities
## Exploitation

{{< figure src="image 1189.png" >}}

lets try getting past this login screen , we will try some sql payloads from a cheatsheet

[https://www.invicti.com/blog/web-security/sql-injection-cheat-sheet/](https://www.invicti.com/blog/web-security/sql-injection-cheat-sheet/)

{{< figure src="image 1190.png" >}}

{{< figure src="image 1191.png" >}}

this one gets us in , and we are greeted with this welcome.php page

{{< figure src="image 1192.png" >}}

{{< figure src="image 1193.png" >}}

lets try terminating the command and following it up with a basic cmd

{{< figure src="image 1194.png" >}}

ok damn so it works , lets try getting a rev shell

we got our netcat up

{{< figure src="image 1195.png" >}}

{{< figure src="image 1196.png" >}}

ok so this does not work , uhh lets check the requests that we are sending with burpsuite and see if we can do anything there

{{< figure src="image 1197.png" >}}

ok so 2 things are happening

1. there is some hsot condition
2. the code is being url encoded

lets try removing all that  while preserving the encoding

{{< figure src="image 1198.png" >}}

this does not work , lets try another variation of the netcat command

{{< figure src="image 1199.png" >}}

this works and we now have our shell

{{< figure src="image 1200.png" >}}

{{< figure src="image 1201.png" >}}

and there ,we have our user flag grabbed right off the bat

time to do some privesc for getting root access

we go to the tmp folder nd use wget to get linpeas from the python serv we started

{{< figure src="image 1202.png" >}}

now lets run linpeas

{{< figure src="image 1203.png" >}}


oops i forgot to upgrade the shell , we will do that after this

{{< figure src="image 1204.png" >}}

{{< figure src="image 1205.png" >}}

there we upgraded the shell, now lets check the lin peas result

{{< figure src="image 1206.png" >}}

ok so pwnkit seems to be an exploit for this, i have used it before nd dont want to use it rn so lets look a bit more

{{< figure src="image 1207.png" >}}

ok so the orangish box tells us that this is 90% a priv esc vector , and it probably is because its a cron job being run with usr priv to create a file w root priv. we can use this to create our rev shell for us to get into 

also the *s at the end lets put them on a cron decoder thing nd see what it means 

https://crontab.guru/V

{{< figure src="image 1208.png" >}}

so with this we can tell that the job is being run every minute

now lets visit this dir

{{< figure src="image 1209.png" >}}

in the artisan folder lets put this php rev shell code

[https://github.com/pentestmonkey/php-reverse-shell/blob/master/php-reverse-shell.php](https://github.com/pentestmonkey/php-reverse-shell/blob/master/php-reverse-shell.php)

{{< figure src="image 1210.png" >}}

change accordingly

{{< figure src="image 1211.png" >}}

there we go , we have our shell now time to grab our root flag

{{< figure src="image 1212.png" >}}
