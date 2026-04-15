---
title: "swagshop"
date: 2024-08-29
draft: false
description: "HackTheBox swagshop writeup"
tags: ["hackthebox", "htb", "linux", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# swagshop

## Overview

- **OS:** Linux
- **IP:** 10.10.10.140
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

to be continued.

## Enumeration

nmap results

{{< figure src="image 1122.png" >}}

adding 10.10.10.140 swagshop.htb to our /etc/hosts folder we are able to access the site

dirsearch

{{< figure src="image 1123.png" >}}

{{< figure src="image 1124.png" >}}

Release_notes.txt directory

{{< figure src="image 1125.png" >}}

ok so i thought this site would be useful for getting the version of magneto running, but no its redirecting us to another site to get the current release notes, which makes this useless.

lets try using a tool called magescan instead to get the version 

follow these commands

```python
    sudo apt update
    sudo apt install php-cli -y
    wget https://github.com/steverobbins/magescan/releases/latest/download/magescan.phar
    chmod +x magescan.phar
    ./magescan.phar
```

{{< figure src="image 1126.png" >}}

{{< figure src="image 1127.png" >}}

nice , our **magento version is 1.9.0.0**

oh wow we got some db credentials form the local xml directory we found from dirbusting.

{{< figure src="image 1128.png" >}}

root:fMVWh7bDHpgZkyfqQXreTjU9

dbname:swagshop 

key:b355a9e0cd018d3f7f03607141518419


## Vulnerabilities


{{< figure src="image 1129.png" >}}

lets check out the remote code exec one

shoplift 

{{< figure src="image 1130.png" >}}

## Exploitation

{{< figure src="image 1131.png" >}}

ok lets check out this and see if there any changes that have to be made to the script.

{{< figure src="image 1132.png" >}}

lets see if we can access that link specified as the target url

{{< figure src="image 1133.png" >}}

ok so we cant access the page, lets try 

on messing with the site 

{{< figure src="image 1134.png" >}}

i realized that any page that i visit has index.php being added at the start of the url , lets try adding that to the target url and see if we can access the page or not.

{{< figure src="image 1135.png" >}}

and boom it works, lets change this in the script accordingly

first remove these unnecessary characters

{{< figure src="image 1136.png" >}}

{{< figure src="image 1137.png" >}}

{{< figure src="image 1138.png" >}}


ok so once this script executes it will create a another acc with these credentials for us to login with.

{{< figure src="image 1139.png" >}}

ok now lets run it 

{{< figure src="image 1140.png" >}}

ok wow it worked , lets try those credentials no w

we are getting this page??

{{< figure src="image 1141.png" >}}

oh nvm on pressing the back page button we are greeted with this

{{< figure src="image 1142.png" >}}

we are in the admin panel!

remember we came across some magento exploit that required us to be authenticated?

now that we are authenticated, lets visit that 

{{< figure src="image 1143.png" >}}

{{< figure src="image 1144.png" >}}

{{< figure src="image 1145.png" >}}

lets get the exact date from the local xml file

{{< figure src="image 1146.png" >}}

comment the first few lines out and these lines to the script

change from 7d to 2y here as there were no orders in the past 2 years

{{< figure src="image 1147.png" >}}

ok we are ready to run the script now

{{< figure src="image 1148.png" >}}

lets fix this error

{{< figure src="image 1149.png" >}}

{{< figure src="image 1150.png" >}}

kept getting this error , got fustrated will attempt again
