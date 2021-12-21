// Please implement your solution in this file

export const fetchPastLaunches = () => {
  const url = 'https://api.spacexdata.com/v3/launches/past';

  fetch(url, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      const filteredData = prepareData(data) //Prepare data
      renderData(filteredData) //Render data
})
}

const prepareData = (data) => {  
  const filterParam = { launch_year: '2018', customerName : 'nasa' }; //filterParam as per requirement

  try {
      return data.filter(item => {
          const payloads = item.rocket && item.rocket.second_stage && item.rocket.second_stage.payloads
        
          return item.launch_year === filterParam.launch_year && payloads
          .find(payload => payload.customers
            .filter(customer => customer.toLowerCase() // toLowerCase() is used to ignore case sensitivity
            .includes(filterParam.customerName)).length > 0) // includes() is used to check if the customerName is present in the payload.customers array
        })
        .map(item => {
          return {
                flight_number: item.flight_number,
                mission_name: item.mission_name,
                payloads_count: item.rocket.second_stage.payloads.length, // payloads.length is used to get the count of payloads
            }
        })
        .sort((a, b) => b.flight_number - a.flight_number) //Sort by flight number
        .sort((a, b) =>  b.payloads_count - a.payloads_count) //Sort by payloads count
    
  } catch (error) {
    console.error(error) //Log error
  }
}

const renderData = (data) => {
  const node = document.getElementById('out');

  try {
      const jsonText = JSON.stringify(data,null, 2)
      node.innerHTML = jsonText;
    
  } catch (error) {
    node.innerHTML = error;
  }
}

module.exports = {
  prepareData,
  renderData,
  fetchPastLaunches,
};
