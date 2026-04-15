---
title: "nmap"
categories: ["Enumeration"]
---

### Go to
```bash
nmap -p- <ip addr> -sCV -A -Pn --min-rate=20000
```

### Going through nmap scripts

```bash
ls -al /usr/share/nmap/scripts/ | grep ftp-
```

### Top UDP

```bash
nmap 10.129.18.188 -sU -top-ports=100 --min-rate=20000
```

### Useful Switches

- `sn` → Ping sweep
- `sS` → TCP SYN
- `Pn` → Disable host discovery
- `p-` → All ports
- `sV` → Version detection
- `A` → OS detect + scripts + traceroute
- `O` → OS detection
- `T4` → Faster scan
- `sC` → Default scripts

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