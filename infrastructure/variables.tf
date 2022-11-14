##################################################################################
# VARIABLES
##################################################################################

variable "aws_access_key" { type = string }
variable "aws_secret_key" { type = string }
variable "dynamodb_table_name" { type = string }
variable "nhl_match_points_table_name" { type = string }
variable "nhl_match_points_table_hashKey" { type = string }

# variable "feed" { type =  string }
# variable "consumer_key" { type =  string }
# variable "consumer_secret" { type =  string }
# variable "access_token" { type =  string }
# variable "access_token_secret" { type =  string }