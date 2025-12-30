# Mechant Record Save

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /api/v1/merchant/record:
    post:
      summary: Mechant Record Save
      deprecated: false
      description: 상인의 기록을 저장합니다
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
                  description: 물고기의 사진
                  example: file:///Users/0x000000ef/balance_hitting/image copy.png
                seafoodType:
                  description: 물고기의 종
                  example: Mackeral
                  type: string
                marketPrice:
                  type: integer
                  description: 싯가
                  example: 5000
                estimatedWeight:
                  type: number
                  description: 추정된 무게
                  example: 5
                merchantWeight:
                  type: number
                  description: 실제 상인이 측정한 무게
                  example: 5
                latitude:
                  type: number
                  description: 위도
                  example: 5
                longitude:
                  type: number
                  description: 경도
                  example: 5
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
                    $ref: '#/components/schemas/Record'
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
      x-run-in-apidog: https://app.apidog.com/web/project/1164787/apis/api-26099540-run
components:
  schemas:
    Record:
      type: object
      properties:
        recordId:
          type: integer
          x-apidog-mock: '1024'
          description: 저장한 기록의 id
        msg:
          type: string
          x-apidog-mock: 기록이 성공적으로 저장되었습니다.
          description: 기록 저장과 관련한 메세지
      x-apidog-orders:
        - recordId
        - msg
      required:
        - recordId
        - msg
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
  securitySchemes: {}
servers: []
security: []

```