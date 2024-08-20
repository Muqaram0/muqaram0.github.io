---
title: HackTheBox_Brainfuck w/o Metasploit
date: 2024-07-29 01:22:00 -500
categories: [hackthebox,CTF,writeups]
tags: [ctf,hackthebox,writeup,linux,insane]
---


## HTB - Brainfuck

![Image](/assets/img/brainfuck/brainfuck.png)

## Enumeration

nmap scan results

![Image](/assets/img/brainfuck/Untitled.png)

homepage

![Image](/assets/img/brainfuck/Untitled_1.png)

inspecting the certificate

![Image](/assets/img/brainfuck/Untitled_2.png)

![Image](/assets/img/brainfuck/Untitled_3.png)

www.brainfuck.htb

sup3rs3cr3t.brainfuck.htb

adding these to our /etc/hosts file 

![Image](/assets/img/brainfuck/Untitled_4.png)

sup3rs3cr3t.brainfuck.htb

![Image](/assets/img/brainfuck/Untitled_5.png)

www.brainfuck.htb

![Image](/assets/img/brainfuck/Untitled_6.png)

wpscan enumeration for WordPress sites

![Image](/assets/img/brainfuck/Untitled_7.png)

![Image](/assets/img/brainfuck/Untitled_8.png)

![Image](/assets/img/brainfuck/Untitled_9.png)

lets get a list of vulnerabilities as well by giving the apikey using the api switch —api-token [apikey]

![Image](/assets/img/brainfuck/Untitled_10.png)

on checking dev-update poste we find the username as admin

![Image](/assets/img/brainfuck/Untitled_11.png)

lets use wpscan to enumerate the users as well, using the enumerate-user flag

![Image](/assets/img/brainfuck/Untitled_12.png)

![Image](/assets/img/brainfuck/Untitled_13.png)

## Vulnerabilities

![Image](/assets/img/brainfuck/Untitled_14.png)

lets check this one out

![Image](/assets/img/brainfuck/Untitled_15.png)

## Exploitation

modifying the script with the credentials we got from our enumeration stage

![Image](/assets/img/brainfuck/Untitled_16.png)

lets now save it as an html file

![Image](/assets/img/brainfuck/Untitled_17.png)

hosting it with python

![Image](/assets/img/brainfuck/Untitled_18.png)

lets visit our local host now

![Image](/assets/img/brainfuck/Untitled_19.png)

![Image](/assets/img/brainfuck/Untitled_20.png)

![Image](/assets/img/brainfuck/Untitled_21.png)

now we should be logging in. On revisiting the site, we used a cookie that tells the browser that we are a logged-in user, allowing us to log in as anyone including admin.

![Image](/assets/img/brainfuck/Untitled_22.png)

![Image](/assets/img/brainfuck/Untitled_23.png)

the site seems to be hinting at smtp, so lets check that out 

dashboard

![Image](/assets/img/brainfuck/Untitled_24.png)

![Image](/assets/img/brainfuck/Untitled_25.png)

![Image](/assets/img/brainfuck/Untitled_26.png)

ok so we have the password being shown here for the user orestis, but its not really visible. lets see if we can do something about it with inspecting

orestis:kHGuERB29DNiNE —> our smtp creds

![Image](/assets/img/brainfuck/Untitled_27.png)

ok now that we have the creds, lets use Evolution

![Image](/assets/img/brainfuck/Untitled_28.png)

![Image](/assets/img/brainfuck/Untitled_29.png)

![Image](/assets/img/brainfuck/Untitled_30.png)

now after we are done with this, we go back to the homepage to be greeted with an authentication request.

lets use the password we got earlier

![Image](/assets/img/brainfuck/Untitled_31.png)

on inspecting the mail we find these credentials

![Image](/assets/img/brainfuck/Untitled_32.png)

lets use these details for the supersecretforum page we found earlier during enumeration.

orestis:**kIEnnfEKJ#9UmdO**

![Image](/assets/img/brainfuck/Untitled_33.png)

![Image](/assets/img/brainfuck/Untitled_34.png)

ok so this tells us that the ssh access now only uses keys, and the key is apparently being shared in a secret forum.

lets check that forum out

![Image](/assets/img/brainfuck/Untitled_35.png)

alright, so the messages seem to be encrypted

so straight off the bat we notice that

![Image](/assets/img/brainfuck/Untitled_36.png)

![Image](/assets/img/brainfuck/Untitled_37.png)

seems to be a signature, and judging by the same word length, these might be the same sentences.

lets try cracking the cipher with this

so right off we can tell that this might be a vernam cipher, lets try using this website to decode the key

![Image](/assets/img/brainfuck/image.png)

![Image](/assets/img/brainfuck/image_1.png)

we get the key as fuck my brain

now lets decrypt the forum using this key we got

![Image](/assets/img/brainfuck/image_2.png)

![Image](/assets/img/brainfuck/image_3.png)

![Image](/assets/img/brainfuck/image_4.png)

![Image](/assets/img/brainfuck/image_5.png)

![Image](/assets/img/brainfuck/image_6.png)

ok so we got the link for the key, lets visit it

for some reason I keep getting this 404 not found page

![Image](/assets/img/brainfuck/image_7.png)

lets try grabbing it with this instead

>>>BASH
wget --no-check-certificate https://brainfuck.htb/8ba5aa10e915218697d1c658cdee0bb8/orestis/id_rsa
>>>BASH

![Image](/assets/img/brainfuck/image_8.png)

alright so this seems to work, now we check out the key

![Image](/assets/img/brainfuck/image_9.png)

we have our RSA private key, but it is encrypted

lets use ssh2john to put the RSA key in a crackable format

![Image](/assets/img/brainfuck/image_10.png)

now lets give the crackthis file to john for decrypting 

![Image](/assets/img/brainfuck/image_11.png)

using john we got our key as 3poulakia!

now lets try logging in with ssh -i id_rsa orestis@brainfuck.htb

![Image](/assets/img/brainfuck/image_12.png)

lets try again but with changing the permissions before

![Image](/assets/img/brainfuck/image_13.png)

and we are in

![Image](/assets/img/brainfuck/image_14.png)

lets check the other files out as well

![Image](/assets/img/brainfuck/image_15.png)

orestis@brainfuck:~$ cat output.txt  
Encrypted Password: 44641914821074071930297814589851746700593470770417111804648920018396305246956127337150936081144106405284134845851392541080862652386840869768622438038690803472550278042463029816028777378141217023336710545449512973950591755053735796799773369044083673911035030605581144977552865771395578778515514288930832915182

so the root.txt file seems to have been encrypted using this 

![Image](/assets/img/brainfuck/image_16.png)

ahh we need to do some priv esc.

lets use linpeas to perform a scan for some possible priv esc vectors

we first get linpeas from https://github.com/peass-ng/PEASS-ng/releases/tag/20240811-aea595a1

![Image](/assets/img/brainfuck/image_17.png)

we will now host it on a server using python for our box, as htb boxes don’t usually have internet access

![Image](/assets/img/brainfuck/image_18.png)

lets use wget now

![Image](/assets/img/brainfuck/image_19.png)

we have it now in our tmp folder, lets run it

![Image](/assets/img/brainfuck/image_20.png)

forgot to change our permissions first

In linpeas, a RED/YELLOW box has a 95% chance at being a viable privesc vector.

![Image](/assets/img/brainfuck/image_21.png)

under the exploit section we find a few to choose from 

lets go with this exploit

![Image](/assets/img/brainfuck/image_22.png)

![Image](/assets/img/brainfuck/image_23.png)

we got the exploit on our system

lets unzip it 

![Image](/assets/img/brainfuck/image_24.png)

now lets list its contents

![Image](/assets/img/brainfuck/image_25.png)

now lets execute it

![Image](/assets/img/brainfuck/image_26.png)

we have our root flag now

![Image](/assets/img/brainfuck/image_27.png)

