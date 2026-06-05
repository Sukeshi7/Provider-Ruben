terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  credentials = file("credentials.json")
  project     = var.project_id
  region      = var.region
  zone        = var.zone
}

resource "google_compute_instance" "wordpress" {
  name         = "vm-wordpress"
  machine_type = "e2-medium"
  tags         = ["wordpress", "http-server", "https-server"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = var.storage
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y docker.io docker-compose
    systemctl enable docker
    systemctl start docker
    docker run -d -p 80:80 \
      -e WORDPRESS_DB_HOST=localhost \
      -e WORDPRESS_DB_NAME=wordpress \
      -e WORDPRESS_DB_USER=wp_user \
      -e WORDPRESS_DB_PASSWORD=${var.db_password} \
      --name wordpress wordpress:6-php8.3-apache
  EOF

  metadata = {
    ssh-keys = "root:${var.ssh_public_key}"
  }
}

resource "google_compute_instance" "multisite" {
  name         = "vm-multisite"
  machine_type = "e2-medium"
  tags         = ["multisite", "http-server"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = var.storage
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y apache2 php8.2 php8.2-mysql mariadb-server
    systemctl enable apache2 mariadb
    systemctl start apache2 mariadb
  EOF

  metadata = {
    ssh-keys = "root:${var.ssh_public_key}"
  }
}

resource "google_compute_instance" "node_server" {
  name         = "vm-node-server"
  machine_type = "e2-medium"
  tags         = ["node-server", "http-server"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = var.storage
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y nodejs npm
    npm install -g pm2
  EOF

  metadata = {
    ssh-keys = "root:${var.ssh_public_key}"
  }
}

resource "google_compute_instance" "vps_debian" {
  name         = "vm-vps-debian"
  machine_type = "e2-micro"
  tags         = ["vps", "ssh-server"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = var.storage
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y openssh-server ufw fail2ban
    systemctl enable ssh
    systemctl start ssh
    echo "root:${var.root_password}" | chpasswd
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
    systemctl restart ssh
  EOF

  metadata = {
    ssh-keys = "root:${var.ssh_public_key}"
  }
}

resource "google_compute_firewall" "allow_http" {
  name    = "allow-http-https"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80", "443", "3000", "8080", "22"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server", "https-server", "node-server", "ssh-server"]
}
