angular.module('pledgr.charities', [])

.controller('CharitiesController', function($scope, $http, $stateParams) {
  $scope.orgids = [
    $stateParams.c1,
    $stateParams.c2,
    $stateParams.c3
  ];
  $scope.orgids.forEach(function(orgid) {
    $http.get('api/donation/charity/stats/86768')
      .success(function(data) {
        $scope.makeChart();
      })
      .error(function(data, status) {
        console.log('ERROR', status, data);
      });
  });

  $scope.makeChart = function() {
    if (data) {
      //var metrics = data.metrics;
      //var program = parseFloat(metrics['Program Expenses']);
      //var administrative = parseFloat(metrics['Administrative Expenses']);
      //var fundraising = parseFloat(metrics['Fundraising Expenses']);
      //var id = '#' + data.orgid;
      //var charityExpensesChartDiv = '<div id=' + data.orgid + '></div>';
      $('#highchart-container').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: 'Monthly Average Temperature'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
      });
    }
  };
});
