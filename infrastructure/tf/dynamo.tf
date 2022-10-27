resource "aws_dynamodb_table" "example" {
  dynamodb_table_name = "<table name>"
  hash_key            = "TestTableHashKey"
  billing_mode        = "PAY_PER_REQUEST"
  stream_enabled      = true
  stream_view_type    = "NEW_AND_OLD_IMAGES"

  attribute {
    name = "TestTableHashKey"
    type = "S"
  }

  replica {
    region_name = "eu-north-1"
  }
}

variable "dynamodb_table_name" {
    type        = string
    description = "DynamoDB Table Name from .env variable"
}