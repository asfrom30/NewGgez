# Deploy routine
* update index.html
* stop port forwarding
* restart port forwarding

# Index.html route
* /home/ggezkr/public_html/index.html

# apache port forwarding(virtual host)
```cmd
$> cd /etc/apache2/conf.d/includes/

$> sudo vi pre_virtualhost_global.conf
```

```vi
ProxyPass / http://localhost:9001/      // your nodejs port 
ProxyPassReverse / http://localhost:9001/   // yout nodejs port
```

```cmd
$> sudo service httpd restart
```