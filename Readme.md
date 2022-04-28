# Covid India API

This is public API for the Covid 19 data of India

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
