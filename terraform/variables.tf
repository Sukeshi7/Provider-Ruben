variable "project_id" {
  description = "ID du projet GCP"
  type        = string
  default     = "cosmic-talent-498515-b0"
}

variable "region" {
  description = "Région GCP"
  type        = string
  default     = "europe-west1"
}

variable "zone" {
  description = "Zone GCP"
  type        = string
  default     = "europe-west1-b"
}

variable "cpu" {
  description = "Nombre de vCPU"
  type        = number
  default     = 1
}

variable "ram" {
  description = "RAM en GB"
  type        = number
  default     = 2
}

variable "storage" {
  description = "Stockage en GB"
  type        = number
  default     = 20
}

variable "db_password" {
  description = "Mot de passe base de données"
  type        = string
  default     = "changeme"
  sensitive   = true
}

variable "root_password" {
  description = "Mot de passe root SSH"
  type        = string
  default     = "changeme"
  sensitive   = true
}

variable "ssh_public_key" {
  description = "Clé publique SSH"
  type        = string
  default     = ""
}
