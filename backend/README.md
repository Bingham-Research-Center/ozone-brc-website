# Backend
Houses the backend code for data processing and server-side logic for the ozone research website.

### How to pull data
Seth/Trevor meeting:
1. Campbell Scientific: to get our BRC four sites' data, use this API code (Seth will send) to pull in data from a given date/time for Campbell Scientific, and other important data.
2. (Expand more here on URL from Seth)
3. AirNow: real-time pulling of the other sites. See John/Seth about password. There are two APIs - one certified (QCs) 

### TODO
- Have log-in information and API keys in separate, local file.
- Seth will send API code to read (from different website, weirdly)
- Scraping a last resort?
- The final way is text file for all AQ data in country. Might be easier via Synoptic. Seth sending stations that we want to show 
- Rangely via ColoWhiteRiverAirQuality (currently can only access via scraping)
- Create a list of stations/metadata about things available 
- Help some data sources get onto Synoptic, including BRC sites 

### Webcams 
- Seth has Python for this 

### Python requirements
For back-end stuff, we are using the same Python 3.11 conda-forge environment (`clyfar` env) as the `clyfar` package.

#### Summary table of data sources per station name
| Station Name | Data Source                  |
|--------------|------------------------------|
| Dinosaur National Monument | Synoptic Weather             |
| Red Wash | Synoptic Weather             |
| Rangely | Colowhiteriverairquality.net |
| Seven Sisters | Campbell Scientific          |
| Horsepool | Campbell Scientific          |
| Ouray | Synoptic Weather             |
| Vernal | Synoptic Weather             |
| Dry Fork | Weather Underground          |
| Whiterocks | Synoptic Weather             |
| Roosevelt | Synoptic Weather (?)         |
| Myton | Synoptic Weather             |
| Castle Peak | Campbell Scientific          |