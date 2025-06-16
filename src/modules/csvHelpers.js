
import Papa from 'papaparse';

function generateCSV(data,keysAndHeaders,name){
    //console.log(data,"data");
    const transformedData = data.map(item => {
      let newItem = {};
      for (const key in item) {
        if (keysAndHeaders[key]) {
          newItem[keysAndHeaders[key]] = item[key];
        }
      }
      return newItem;
    });
    const csv = Papa.unparse(transformedData);
    downloadCSV(csv,name)
  
  }
  function downloadCSV(csv,name) {
    const blob = new Blob([csv], { type: 'text/csv' });
  
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name}.csv`;
  
  document.body.appendChild(link);
  
  link.click();
  
  document.body.removeChild(link);
  }



 export {generateCSV}