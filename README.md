# Github Language Statistics
[![License (AGPL-3.0)](https://img.shields.io/badge/license-AGPL--3.0-brightgreen.svg)](https://www.gnu.org/licenses/agpl-3.0.en.html)
[![Build Status](https://travis-ci.org/madnight/githut.svg?branch=master)](https://travis-ci.org/madnight/githut)
[![Code Climate](https://codeclimate.com/github/madnight/githut/badges/gpa.svg)](https://codeclimate.com/github/madnight/githut)
[![Issue Count](https://codeclimate.com/github/madnight/githut/badges/issue_count.svg)](https://codeclimate.com/github/madnight/githut)
[![dependencies Status](https://david-dm.org/madnight/githut/status.svg)](https://david-dm.org/madnight/githut)
![](https://i.imgur.com/8z1p9io.png)

## Data Generation
### Languages
Get language top list for Github
```SQL
SELECT language.name, COUNT(language.name)
AS count FROM [bigquery-public-data:github_repos.languages]
group by language.name order by count DESC
```

First 10 Results
```Javascript
{"language_name":"JavaScript","count":"1006022"}
{"language_name":"CSS","count":"745573"}
{"language_name":"HTML","count":"663315"}
{"language_name":"Shell","count":"593461"}
{"language_name":"Python","count":"492715"}
{"language_name":"Ruby","count":"365413"}
{"language_name":"Java","count":"340622"}
{"language_name":"PHP","count":"328907"}
{"language_name":"C","count":"286272"}
{"language_name":"C++","count":"267552"}
...
```
### Licenses
Get license top list for Github
```SQL
SELECT license, COUNT(license)
AS count FROM [bigquery-public-data:github_repos.licenses]
group by license order by count DESC
```

Full result
```Javascript
{"license":"mit","count":"1551711"}
{"license":"apache-2.0","count":"455316"}
{"license":"gpl-2.0","count":"376453"}
{"license":"gpl-3.0","count":"284761"}
{"license":"bsd-3-clause","count":"161041"}
{"license":"bsd-2-clause","count":"57412"}
{"license":"unlicense","count":"43899"}
{"license":"lgpl-3.0","count":"38213"}
{"license":"agpl-3.0","count":"38034"}
{"license":"cc0-1.0","count":"28600"}
{"license":"epl-1.0","count":"24074"}
{"license":"lgpl-2.1","count":"23872"}
{"license":"isc","count":"17690"}
{"license":"mpl-2.0","count":"17421"}
{"license":"artistic-2.0","count":"9413"}
```

### Pull Requests
Get the number of Pull Requests per day/month/year
```Javascript
SELECT event as pull_request, COUNT(*) as count FROM (
  SELECT type,
    JSON_EXTRACT(payload, '$.pull_request.base.repo.language') as event,
  FROM [githubarchive:day.20130118]
  WHERE type = 'PullRequestEvent'
)
GROUP by pull_request
HAVING pull_request != 'null'
order by count DESC;
```
### Average Repository Size
Get the average repository size in kilobytes per language
```SQL
SELECT lang, INTEGER((SUM(bytes)/COUNT(lang))/1024) as avg_kb_size_per_repo
FROM ( SELECT * FROM ( SELECT *,
ROW_NUMBER() OVER (PARTITION BY repo_name ORDER BY lang) as num
FROM ( SELECT repo_name,
FIRST_VALUE(language.name) OVER (partition by repo_name order by language.bytes DESC) AS lang,
FIRST_VALUE(language.bytes) OVER (partition by repo_name order by language.bytes DESC) AS bytes,
FROM [bigquery-public-data:github_repos.languages] )
) WHERE num = 1 order by repo_name
) WHERE lang != 'null' GROUP BY lang ORDER BY avg_kb_size_per_repo DESC
```
First 10 Results
```JavaScript
{"lang":"Smali","avg_kb_size_per_repo":"50639"}
{"lang":"C","avg_kb_size_per_repo":"49999"}
{"lang":"Genshi","avg_kb_size_per_repo":"44151"}
{"lang":"Arc","avg_kb_size_per_repo":"37548"}
{"lang":"Web Ontology Language","avg_kb_size_per_repo":"29158"}
{"lang":"OpenEdge ABL","avg_kb_size_per_repo":"20924"}
{"lang":"Gnuplot","avg_kb_size_per_repo":"20083"}
{"lang":"Bluespec","avg_kb_size_per_repo":"17640"}
{"lang":"LLVM","avg_kb_size_per_repo":"14247"}
{"lang":"SMT","avg_kb_size_per_repo":"14146"}
...
```

### Manual  
Googles BigQuery is free for public datasets like Github, Reddit or Stackoverflow. It is limited to 1000 GB query volume per month. One of the querys above takes about 50-200 MB query volume. The public dataset for Github is available here: https://cloud.google.com/bigquery/public-data/github
