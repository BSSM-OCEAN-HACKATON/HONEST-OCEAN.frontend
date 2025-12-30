# Merchant Record List

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /api/v1/merchant/records:
    get:
      summary: Merchant Record List
      deprecated: false
      description: 이때까지의 기록 리스트를 불러옵니다
      tags: []
      parameters:
        - name: page
          in: query
          description: 페이지
          required: false
          example: 1
          schema:
            type: integer
        - name: size
          in: query
          description: 한 페이지에 출력할 열 수
          required: false
          example: 10
          schema:
            type: integer
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
                    description: 성공 여부
                  data:
                    type: object
                    properties:
                      record:
                        type: array
                        items:
                          $ref: '#/components/schemas/RecordDetail'
                        description: 기록 배열
                    x-apidog-orders:
                      - record
                    required:
                      - record
                    description: 데이터
                    x-apidog-ignore-properties: []
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
      x-run-in-apidog: https://app.apidog.com/web/project/1164787/apis/api-26099545-run
components:
  schemas:
    RecordDetail:
      type: object
      properties:
        recordId:
          type: string
        'image ':
          type: string
        merchantWeight:
          type: string
        data:
          type: object
          properties:
            location:
              $ref: '#/components/schemas/Location'
          x-apidog-orders:
            - location
          required:
            - location
          x-apidog-refs: {}
          x-apidog-ignore-properties: []
        stats:
          $ref: '#/components/schemas/SeafoodStats'
      x-apidog-orders:
        - recordId
        - 'image '
        - merchantWeight
        - data
        - stats
      required:
        - recordId
        - 'image '
        - merchantWeight
        - data
        - stats
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
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
    Location:
      type: object
      properties:
        latitude:
          type: number
          x-apidog-mock: '128.86'
          description: 현재 위도
        longitude:
          type: number
          x-apidog-mock: '35.15'
          description: 현재 경도
      x-apidog-orders:
        - latitude
        - longitude
      required:
        - latitude
        - longitude
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
  securitySchemes: {}
servers: []
security: []

```