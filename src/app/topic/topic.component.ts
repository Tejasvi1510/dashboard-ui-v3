import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanyService } from '../Services/company.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit, OnDestroy {

  data: any;
  dataByRegion: any;
  uniqueTopics: any;
  dataAfterTopicFilter: any;
  

  regionLbel: string[] = [];
  intensityData: number[] = [];
  relevanceData: number[] = [];
  likelihoodData: number[] = [];
  lineChart: Chart | null = null;
 
  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    this.companyService.getRecords().subscribe(
      (resp) => {
        this.data = resp;
        this.uniqueTopics = this.getUniqueTopic(this.data);
        console.log(this.uniqueTopics);
      }
    );

    this.companyService.getDataByRegion().subscribe(
      (resp) => {
        console.log(resp);
        this.dataByRegion = resp;
         this.processRegionData();
         this.showLineChart();
      },
      (err) => {
        console.log(err);
      }
    );

 }

 private processFilteredData(): void {
  this.regionLbel = [];
  this.intensityData = [];
  this.relevanceData = [];
  this.likelihoodData = [];

  this.dataAfterTopicFilter.forEach((item: any) => {
    if (item[0] !== "") {
      this.regionLbel.push(item[0]);
      this.intensityData.push(item[1]);
      this.relevanceData.push(item[2]);
      this.likelihoodData.push(item[3]);
    }
 

   
  });
}




 onFilterChange(event: any): void {
  this.clearChartData();
  
  const filterValue = event.target.value;
  console.warn('value of filter is ', filterValue);

  if (filterValue === 'all') {
    this.processRegionData();
    this.showLineChart();
  } else {
    this.companyService.getDataByFilter("topic",filterValue).subscribe(
      (resp) => {
        console.log(resp);
        this.dataAfterTopicFilter = resp;
        this.processFilteredData();
        this.showLineChart();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}





 private getUniqueTopic(data: any[]): string[] {
  const topicSet = new Set<string>();
  data.forEach((item) => {
    if (item.topic) {
      topicSet.add(item.topic);
    }
  });
  console.log(topicSet);
  return Array.from(topicSet);
}

 private processRegionData(): void {
  this.regionLbel = [];
  this.intensityData = [];
  this.relevanceData = [];
  this.likelihoodData = [];

   this.dataByRegion.forEach((item: any) => {
    if (item[0] !== "") {
      this.regionLbel.push(item[0]);
      this.intensityData.push(item[1]);
      this.relevanceData.push(item[2]);
      this.likelihoodData.push(item[3]);
    
    }
  });
}

private clearChartData(): void {
  if (this.lineChart) {
    this.lineChart.destroy();
    this.lineChart = null;
  }
}

showLineChart(): void {
  this.clearChartData();
  console.log("after ");
  const ctx = document.getElementById('lineChart') as HTMLCanvasElement;

  this.lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: this.regionLbel,
      datasets: [
        {
          label: 'Intensity',
          data: this.intensityData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Relevance',
          data: this.relevanceData,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Likelihood',
          data: this.likelihoodData,
          borderColor: 'rgb(255, 205, 86)',
          backgroundColor: 'rgba(255, 205, 86, 0.5)',
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}






  ngOnDestroy(): void {
    this.clearChartData();
  }
}
