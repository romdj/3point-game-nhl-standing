resource "aws_dynamodb_table" "nhl_match_points_table" {
  dynamodb_table_name           = "<env>"
  billing_mode                  = "PAY_PER_REQUEST"
  hash_key                      = "gamePk"
  attribute {
    name = "gamePk"
    type = "S"
  }
}

variable "dynamodb_table_name" {
    type        = string
    description = "DynamoDB Table Name from .env variable"
}

#   attribute {
#     name = "GameTitle"
#     type = "S"
#   }

#   attribute {
#     name = "TopScore"
#     type = "N"
#   }

#   ttl {
#     attribute_name = "TimeToExist"
#     enabled        = false
#   }

#   global_secondary_index {
#     name               = "GameTitleIndex"
#     hash_key           = "GameTitle"
#     range_key          = "TopScore"
#     write_capacity     = 10
#     read_capacity      = 10
#     projection_type    = "INCLUDE"
#     non_key_attributes = ["UserId"]
#   }

  # tags = {
  #   Name        = "dynamodb-table-1"
  #   Environment = "dev"
  #   # Service     = 
  # }
# }
