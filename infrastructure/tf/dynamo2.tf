resource "aws_dynamodb_table" "basic-dynamodb-table" {
  dynamodb_table_name           = "<table name>"
  billing_mode                  = "PROVISIONED"
  read_capacity                 = 10
  write_capacity                = 10
  hash_key                      = "GameId"
#   range_key                     = "GameTitle"

  attribute {
    name = "GameId"
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

  tags = {
    Name        = "dynamodb-table-1"
    Environment = "dev"
    # Service     = 
  }
}
