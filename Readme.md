# Covid India API

This is public API for the Covid 19 data of India

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/e71567f1f792c30e1ae0?action=collection%2Fimport#?env%5BMailgun%20Postman%20Environment%5D=W3sia2V5IjoiQVBJX0tFWSIsInZhbHVlIjoiNzM0MzE3MDM1M2RkMDU5OGIzOWFlOGRkYjcwYWMxMjItMDQ3MGExZjctYWI4OWEyYzkiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoidGV4dCIsInNlc3Npb25WYWx1ZSI6IjczNDMxNzAzNTNkZDA1OThiMzlhZThkZGI3MGFjMTIyLTA0NzBhMWY3LWFiODlhMmM5Iiwic2Vzc2lvbkluZGV4IjowfSx7ImtleSI6IkJBU0VfVVJMIiwidmFsdWUiOiJodHRwczovL2FwaS5tYWlsZ3VuLm5ldC92MyIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJ0ZXh0Iiwic2Vzc2lvblZhbHVlIjoiaHR0cHM6Ly9hcGkubWFpbGd1bi5uZXQvdjMiLCJzZXNzaW9uSW5kZXgiOjF9LHsia2V5IjoibXlkb21haW4iLCJ2YWx1ZSI6InNhbmRib3g5NzRhYWQ2MzkwOTU0ZTM5Yjg4ZjRiZmE4Y2YxODRjMy5tYWlsZ3VuLm9yZyIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJ0ZXh0Iiwic2Vzc2lvblZhbHVlIjoic2FuZGJveDk3NGFhZDYzOTA5NTRlMzliODhmNGJmYThjZjE4NGMzLm1haWxndW4ub3JnIiwic2Vzc2lvbkluZGV4IjoyfSx7ImtleSI6InRva2VuIiwidmFsdWUiOiJZWEJwT2pjek5ETXhOekF6TlROa1pEQTFPVGhpTXpsaFpUaGtaR0kzTUdGak1USXlMVEEwTnpCaE1XWTNMV0ZpT0RsaE1tTTUiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoidGV4dCIsInNlc3Npb25WYWx1ZSI6IllYQnBPamN6TkRNeE56QXpOVE5rWkRBMU9UaGlNemxoWlRoa1pHSTNNR0ZqTVRJeUxUQTBOekJoTVdZM0xXRmlPRGxoTW1NNSIsInNlc3Npb25JbmRleCI6M31d)
<a href="https://rapidapi.com/heetkv/api/covid-india2/" target="_blank">
<img src="https://files.readme.io/1de5087-rapidapi-badge-light.png" width="215" alt="Connect on RapidAPI">
</a>

## Version: 1.0.0

**Contact information:**  
heetkv@gmail.com

**License:** [MIT](https://choosealicense.com/licenses/mit/)

### /states

#### GET

##### Summary

Get all Indian states Data

##### Description

Get all the tasks

##### Parameters

| Name     | Located in | Description                                           | Required | Schema |
| -------- | ---------- | ----------------------------------------------------- | -------- | ------ |
| max_date | query      | Max Date for the state data to be fetched(yyyy-mm-dd) | No       | string |
| min_date | query      | Min Date for the state data to be fetched(yyyy-mm-dd) | No       | string |

##### Responses

| Code | Description          | Schema                              |
| ---- | -------------------- | ----------------------------------- |
| 200  | successful operation | [ [StateResponse](#stateresponse) ] |
| 400  | Invalid status value | [InvalidResponse](#invalidresponse) |

### /states/code/{state_code}

#### GET

##### Summary

Get Indian state data by state code

##### Description

Get Indian state data by state code

##### Parameters

| Name       | Located in | Description                                           | Required | Schema |
| ---------- | ---------- | ----------------------------------------------------- | -------- | ------ |
| state_code | path       | State Code                                            | Yes      | string |
| max_date   | query      | Max Date for the state data to be fetched(yyyy-mm-dd) | No       | string |
| min_date   | query      | Min Date for the state data to be fetched(yyyy-mm-dd) | No       | string |

##### Responses

| Code | Description                      | Schema                              |
| ---- | -------------------------------- | ----------------------------------- |
| 200  | successful operation             | [ [StateResponse](#stateresponse) ] |
| 400  | Invalid State Code or Date value | [InvalidResponse](#invalidresponse) |

### /states/code/{state_abbr}

#### GET

##### Summary

Get Indian state data by state abbreviation

##### Description

Get Indian state data by state abbreviation

##### Parameters

| Name       | Located in | Description                                           | Required | Schema |
| ---------- | ---------- | ----------------------------------------------------- | -------- | ------ |
| state_abbr | path       | State Abbreviation                                    | Yes      | string |
| max_date   | query      | Max Date for the state data to be fetched(yyyy-mm-dd) | No       | string |
| min_date   | query      | Min Date for the state data to be fetched(yyyy-mm-dd) | No       | string |

##### Responses

| Code | Description                      | Schema                              |
| ---- | -------------------------------- | ----------------------------------- |
| 200  | successful operation             | [ [StateResponse](#stateresponse) ] |
| 400  | Invalid State Code or Date value | [InvalidResponse](#invalidresponse) |

### /country

#### GET

##### Summary

Get India's Covid Data

##### Description

Get India's Covid Data

##### Parameters

| Name     | Located in | Description                                           | Required | Schema |
| -------- | ---------- | ----------------------------------------------------- | -------- | ------ |
| max_date | query      | Max Date for the state data to be fetched(yyyy-mm-dd) | No       | string |
| min_date | query      | Min Date for the state data to be fetched(yyyy-mm-dd) | No       | string |

##### Responses

| Code | Description          | Schema                                  |
| ---- | -------------------- | --------------------------------------- |
| 200  | successful operation | [ [CountryResponse](#countryresponse) ] |
| 400  | Invalid status value | [InvalidResponse](#invalidresponse)     |

### Models

#### StateResponse

| Name            | Type    | Description |
| --------------- | ------- | ----------- |
| id              | integer |             |
| active_today    | integer |             |
| death_today     | integer |             |
| recovered_today | integer |             |
| active          | integer |             |
| death           | integer |             |
| recovered       | integer |             |
| positive        | integer |             |
| positive_today  | integer |             |
| state_name      | string  |             |
| state_code      | string  |             |
| state_abbr      | string  |             |
| date            | string  |             |

#### CountryResponse

| Name             | Type    | Description |
| ---------------- | ------- | ----------- |
| id               | integer |             |
| active_today     | integer |             |
| death_today      | integer |             |
| recovered_today  | integer |             |
| vaccinated       | integer |             |
| vaccinated_today | integer |             |
| active           | integer |             |
| death            | integer |             |
| recovered        | integer |             |
| date             | string  |             |

#### InvalidResponse

| Name  | Type   | Description |
| ----- | ------ | ----------- |
| error | string |             |
