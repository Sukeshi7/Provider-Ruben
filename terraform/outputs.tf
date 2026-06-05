output "wordpress_ip" {
  description = "IP publique VM WordPress"
  value       = google_compute_instance.wordpress.network_interface[0].access_config[0].nat_ip
}

output "multisite_ip" {
  description = "IP publique VM Multisite"
  value       = google_compute_instance.multisite.network_interface[0].access_config[0].nat_ip
}

output "node_server_ip" {
  description = "IP publique VM Node.js"
  value       = google_compute_instance.node_server.network_interface[0].access_config[0].nat_ip
}

output "vps_debian_ip" {
  description = "IP publique VPS Debian"
  value       = google_compute_instance.vps_debian.network_interface[0].access_config[0].nat_ip
}
