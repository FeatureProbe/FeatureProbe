Docker Hub 国内源使用帮助
=====================

说明
----
国内从 Docker Hub 拉取镜像有时网络较慢，此时可以配置镜像加速器。以下是国内的镜象加速器服务。


地址
----
| 地址      | 镜像加速器	 |
| ----------- | ----------- |
| `https://docker.mirrors.ustc.edu.cn/`      | 中科大       |
| `https://hub-mirror.c.163.com`   | 网易云       |


Linux
-----

对于使用 systemd 的系统（Ubuntu 16.04+、Debian 8+、CentOS 7）， 在配置文件 ``/etc/docker/daemon.json`` 中加入：
```
{
   "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn/", "https://hub-mirror.c.163.com"]
}
```

重新启动 dockerd：
```
sudo systemctl restart docker
```

macOS
-----

1. 打开 "Docker.app"
2. 进入偏好设置页面(快捷键 ``⌘,`` )
3. 打开 "Docker Engine" 选项卡
4. 参考 Linux 中 "使用 systemd 系统" 的配置，在 JSON 配置中添加 ``"registry-mirrors"`` 一项。

Windows
-------

在系统右下角托盘 Docker 图标内右键菜单选择 `Settings` ，打开配置窗口后左侧导航菜单选择 `Docker Engine` 。参考 Linux 中 "使用 systemd 系统" 的配置，在 JSON 配置中添加 `"registry-mirrors"` 一项 ，之后点击 "Apply & Restart" 保存并重启 Docker 即可。

检查 Docker Hub 是否生效
------------------------

在命令行执行 `docker info` ，如果从结果中看到了如下内容，说明配置成功。
```
Registry Mirrors:
  https://docker.mirrors.ustc.edu.cn/
  https://hub-mirror.c.163.com
```
