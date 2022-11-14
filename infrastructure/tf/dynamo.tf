resource "aws_dynamodb_table" "nhl-standings" {
  dynamodb_table_name           = "<tableName>"
  billing_mode                  = "ON-DEMAND"
  hash_key                      = "gamePk"

  attribute {
    name = "gamePk"
    type = "S"
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
}
