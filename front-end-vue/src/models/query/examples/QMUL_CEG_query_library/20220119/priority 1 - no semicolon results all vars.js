[
  {
    "rdfs__label": "Significant Mental Illness (SMI)",
    "im__property": [{ "_id": "im:hasProfile" }],
    "im__valueIn": [{ "_id": "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf" }],
    "im__order": 0
  },
  {
    "rdfs__label": "Hypertension (not resolved)",
    "im__pathTo": [{ "_id": "im:isSubjectOf" }],
    "im__entityType": [{ "_id": "im:Event" }],
    "im__fromLatest": [
      {
        "im__sortField": [{ "_id": "im:effectiveDate" }],
        "im__and": [
          {
            "im__property": [{ "_id": "im:concept" }],
            "im__var": "concept6",
            "im__valueIn": [
              { "_id": "urn:uuid:be880ad6-5dab-48c2-8e94-d5c5219afb4f" },
              { "_id": "urn:uuid:aafda1f0-02fc-45bc-bd6f-b899efe9547d" }
            ],
            "im__order": 0
          },
          {
            "im__property": [{ "_id": "im:effectiveDate" }],
            "im__var": "effectiveDate7",
            "im__order": 1
          }
        ]
      }
    ],
    "im__property": [{ "_id": "im:concept" }],
    "im__var": "concept8",
    "im__valueIn": [{ "_id": "urn:uuid:be880ad6-5dab-48c2-8e94-d5c5219afb4f" }],
    "im__order": 0
  },
  {
    "im__property": [{ "_id": "im:concept" }],
    "im__var": "concept6",
    "im__valueIn": [
      { "_id": "urn:uuid:be880ad6-5dab-48c2-8e94-d5c5219afb4f" },
      { "_id": "urn:uuid:aafda1f0-02fc-45bc-bd6f-b899efe9547d" }
    ],
    "im__order": 0
  },
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
