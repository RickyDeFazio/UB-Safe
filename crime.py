import json
import urllib.request


def get_crime_data(url):
  response = urllib.request.urlopen(url)
  content_string = response.read().decode()
  content = json.loads(content_string)
  array = []
  for obj in content:
    inner_array = []
    try: 
      inner_array.append(float(obj["latitude"]))
      inner_array.append(float(obj["longitude"]))
      inner_array.append(obj["incident_type_primary"])
      array.append(inner_array)
    except:
      print("Error")
  answer = json.dumps(array)
  return answer