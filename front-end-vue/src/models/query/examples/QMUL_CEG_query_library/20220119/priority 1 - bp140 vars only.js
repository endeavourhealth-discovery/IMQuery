[
  {
    "im__property": [{ "_id": "im:concept" }],
    "im__var": "concept9",
    "im__valueIn": [
      {
        "_id": "urn:uuid:be2f235a-f31b-4c07-8b5e-7aa5fa5166e4",
        "name": "SAP - Systolic arterial pressure ...."
      }
    ],
    "im__order": 0
  },
  {
    "im__property": [{ "_id": "im:effectiveDate" }],
    "im__var": "effectiveDate11",
    "im__value": [
      { "im__comparison": "greaterThanOrEqual", "im__value": "-18" }
    ],
    "im__valueFunction": [
      {
        "im__argument": [
          { "im__parameter": "units", "im__value": "MONTH" },
          { "im__parameter": "firstDate", "im__value": "$referenceDate" },
          { "im__parameter": "secondDate", "im__value": "effectiveDate11" }
        ],
        "im__functionName": [{ "_id": "im:TimeDifference" }]
      }
    ],
    "im__order": 2
  },
  {
    "im__property": [{ "_id": "im:concept" }],
    "im__var": "concept12",
    "im__valueIn": [
      {
        "_id": "urn:uuid:6484b281-3dd9-47ec-be44-259eeca94917",
        "name": "SAP - Systolic arterial pressure ...."
      }
    ],
    "im__order": 0
  },
  {
    "im__property": [{ "_id": "im:numericValue" }],
    "im__var": "numericValue13",
    "im__value": [
      { "im__comparison": "greaterThanOrEqual", "im__value": "140" }
    ],
    "im__order": 1
  }
]
