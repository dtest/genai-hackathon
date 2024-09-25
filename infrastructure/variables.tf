// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

variable "gcp_project" {
  type = string
}

variable "gcp_project_services" {
  type        = list(any)
  description = "GCP Service APIs (<api>.googleapis.com) to enable for this project"
  default     = [
    "compute.googleapis.com",
    "servicenetworking.googleapis.com",
    "container.googleapis.com",
    "alloydb.googleapis.com",
    "vpcaccess.googleapis.com",
    "secretmanager.googleapis.com",
    "run.googleapis.com",
    "aiplatform.googleapis.com",
    "storage.googleapis.com"
  ]
}

variable "gcp_region" {
  type      = string
  default   = "us-central1"
}

variable "alloydb_sa" {
    type = string
    description = "Service Account to use for alloydb proxy"
    default = "alloydb-iap"
}
