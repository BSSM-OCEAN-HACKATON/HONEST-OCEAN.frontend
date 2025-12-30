# Analyze Fish

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /api/v1/fish/analyze:
    post:
      summary: Analyze Fish
      deprecated: false
      description: 사진과 측정된 길이에 따라 물고기를 분석합니다.
      tags: []
      parameters: []
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                image:
                  format: binary
                  type: string
                  description: 물고기의 이미지
                  example:
                    - file:///Users/0x000000ef/balance_hitting/image copy.png
                    - file:///Users/0x000000ef/balance_hitting/image copy.png
                fishLength:
                  type: number
                  description: 물고기의 길이
                  example: 30
            examples: {}
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    x-apidog-mock: success
                    description: 성공 여부
                  data:
                    $ref: '#/components/schemas/SeafoodStats'
                    description: 물고기의 스펙
                x-apidog-orders:
                  - status
                  - data
                required:
                  - status
                  - data
                x-apidog-ignore-properties: []
          headers: {}
          x-apidog-name: 성공
      security: []
      x-apidog-folder: ''
      x-apidog-status: released
      x-run-in-apidog: https://app.apidog.com/web/project/1164787/apis/api-26099538-run
components:
  schemas:
    SeafoodStats:
      type: object
      properties:
        seafoodType:
          type: string
          x-apidog-mock: 광어
          description: 물고기의 종
        marketPrice:
          type: integer
          x-apidog-mock: '35000'
          description: 싯가
        estimatedWeight:
          type: number
          x-apidog-mock: '1.25'
          description: 추정된 무게
        currentlyForbidden:
          type: boolean
          description: 금어기 인지, 금지 체장인지 모두 고려
      x-apidog-orders:
        - seafoodType
        - marketPrice
        - estimatedWeight
        - currentlyForbidden
      required:
        - seafoodType
        - marketPrice
        - estimatedWeight
        - currentlyForbidden
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
  securitySchemes: {}
servers: []
security: []

```