---
title: "Brainfuck"
date: 2024-07-28
draft: false
description: "HackTheBox Brainfuck writeup"
tags: ["hackthebox", "htb", "linux", "insane"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Brainfuck

## Overview

- **OS:** Linux
- **IP:** 10.10.10.17
- **Difficulty:** Insane
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

wpscan, vignere, cipher, ssh2john, evoution ,linpeas.

## Enumeration

nmap scan results

{{< figure src="Untitled 229.png" >}}

homepage

{{< figure src="Untitled 230.png" >}}

inspecting the certificate

{{< figure src="Untitled 231.png" >}}

{{< figure src="Untitled 232.png" >}}

www.brainfuck.htb

sup3rs3cr3t.brainfuck.htb

adding these to our /etc/hosts file 

{{< figure src="Untitled 233.png" >}}

sup3rs3cr3t.brainfuck.htb

{{< figure src="Untitled 234.png" >}}

www.brainfuck.htb

{{< figure src="Untitled 235.png" >}}

wpscan enumeration for word-press sites

{{< figure src="Untitled 236.png" >}}

{{< figure src="Untitled 237.png" >}}

{{< figure src="Untitled 238.png" >}}

lets get a list of vulnerabilities as well by giving the apikey using the api switch —api-token [apikey]

{{< figure src="Untitled 239.png" >}}

on checking dev-update poste we find the username as admin

{{< figure src="Untitled 240.png" >}}

lets use the wpscan to enumerate the users as well , using the enumerate-user flag

{{< figure src="Untitled 241.png" >}}

{{< figure src="Untitled 242.png" >}}

## Vulnerabilities

{{< figure src="Untitled 243.png" >}}

lets check this one out

{{< figure src="Untitled 244.png" >}}

## Exploitation

modifying the script with the credentials we got from our enumeration stage

{{< figure src="Untitled 245.png" >}}

lets now save it as an html file

{{< figure src="Untitled 246.png" >}}

hosting it with python

{{< figure src="Untitled 247.png" >}}

lets visit our local host now

{{< figure src="Untitled 248.png" >}}

{{< figure src="Untitled 249.png" >}}

{{< figure src="Untitled 250.png" >}}

now we should be logging in , on revisiting the site [ what we just did was , we used a cookie that tells the browser that we are a logged in user and using that we were able to login as anyone including admin.

{{< figure src="Untitled 251.png" >}}

{{< figure src="Untitled 252.png" >}}

the site seems to be hinting at smtp , so lets check that out 

dashboard

{{< figure src="Untitled 253.png" >}}

{{< figure src="Untitled 254.png" >}}

{{< figure src="Untitled 255.png" >}}

ok so we have the password being shown here for the user orestis , but its not really visible , lets see if we can do something about it with inspecting

orestis:kHGuERB29DNiNE —> our smtp creds

{{< figure src="Untitled 256.png" >}}

ok now that we have the creds , let use Evolution 

{{< figure src="Untitled 257.png" >}}

{{< figure src="Untitled 258.png" >}}

{{< figure src="Untitled 259.png" >}}

now after we are done with this , we go back to the homepage to be greeted with a authentication request.

lets use the password we got earlier

{{< figure src="Untitled 260.png" >}}

on inspecting the mail we find these credentials

{{< figure src="Untitled 261.png" >}}

lets use theses details for the supersecretforum page we found earlier during enumeration.

orestis:**kIEnnfEKJ#9UmdO**

{{< figure src="Untitled 262.png" >}}

{{< figure src="Untitled 263.png" >}}

ok so this tells us that the ssh access now only uses keys , and the key is apparently being shared in a secret forum.

lets check that forum out

{{< figure src="Untitled 264.png" >}}

alright, so the messages seem to be encrypted

so straight off the bat we notice that

{{< figure src="Untitled 265.png" >}}

{{< figure src="Untitled 266.png" >}}

seems to be a signature , and judging by the same word length , these might be the same sentences.

lets try cracking the cipher with this

so right off we can tell that this might be a vernam cipher , lets try using this website to decode the key

{{< figure src="image 1151.png" >}}

{{< figure src="image 1152.png" >}}

we get the key as fuck my brain

now lets decrypt the forum using this key we got

{{< figure src="image 1153.png" >}}

{{< figure src="image 1154.png" >}}

{{< figure src="image 1155.png" >}}

{{< figure src="image 1156.png" >}}

{{< figure src="image 1157.png" >}}

ok so we got the link for the key , lets visit it

for some reason i keep getting this 404 not found page

{{< figure src="image 1158.png" >}}

lets try grabbing it with this instead

wget --no-check-certificate [https://brainfuck.htb/8ba5aa10e915218697d1c658cdee0bb8/orestis/id_rsa](https://brainfuck.htb/8ba5aa10e915218697d1c658cdee0bb8/orestis/id_rsa)

{{< figure src="image 1159.png" >}}

alright so this seems to work now we check out the key

{{< figure src="image 1160.png" >}}

we have our RSA private key , but it is encrypted

lets use ssh2john to put the RSA key in a crackable format

{{< figure src="image 1161.png" >}}

now lets give the crackthis file to john for decrypting 

{{< figure src="image 1162.png" >}}

using john we got our key as 3poulakia!

now lets try logging in with ssh -i  id_rsa orestis@brainfuck.htb

{{< figure src="image 1163.png" >}}

lets try again but with changing the permissions before

{{< figure src="image 1164.png" >}}

and we are in 

{{< figure src="image 1165.png" >}}

lets check the other files out as well

{{< figure src="image 1166.png" >}}

orestis@brainfuck:~$ cat output.txt
Encrypted Password: 44641914821074071930297814589851746700593470770417111804648920018396305246956127337150936081144106405284134845851392541080862652386840869768622438038690803472550278042463029816028777378141217023336710545449512973950591755053735796799773369044083673911035030605581144977552865771395578778515514288930832915182

so the root.txt file seems to have been encrypted using this 

{{< figure src="image 1167.png" >}}

ahh we need to some priv esc.

lets use linpeas to perform a scan for some possible priv esc vectors

we first get [linepeas.sh](http://linepeas.sh) from https://github.com/peass-ng/PEASS-ng/releases/tag/20240811-aea595a1

{{< figure src="image 1168.png" >}}

we will now host it on a server using python for our box , as htb boxes dont usually have internet access

{{< figure src="image 1169.png" >}}

lets use wget now

{{< figure src="image 1170.png" >}}

we have it now in our tmp folder , lets run it

{{< figure src="image 1171.png" >}}

forgot to change our permissions first hah

In [linpeas.sh](http://linpeas.sh/), a RED/YELLOW box has a 95% chance at being a viable privesc vector.

{{< figure src="image 1172.png" >}}

under the exploit section we find a few to choose from 

lets go with this exploit

{{< figure src="image 1173.png" >}}

{{< figure src="image 1174.png" >}}

we got the exploit on our system

lets unzip it 

{{< figure src="image 1175.png" >}}

{{< figure src="image 1176.png" >}}

{{< figure src="image 1177.png" >}}

and there we go , root access!

getting our root flag

{{< figure src="image 1178.png" >}}
