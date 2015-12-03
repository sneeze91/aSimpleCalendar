
var Calendar = (function() {
      function Calendar(time, button) {
        var that = this;
        this.time = time;
        this.button = button;
        this.date = new Date(time);
        this.originTime = this.date.getTime();
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
        this.day = this.date.getDay();
        this.matrixSize = 7 * 6;
        this.button.addEventListener('click',function(e){
          e.stopPropagation();
          that.clearCalendar();
          that.showCalendar();
          that.showDateTitle();
          that.bindEvent();
        });
      };
      Calendar.prototype._dateOfThreeMonth = function(year, month) {
        return [
          this._generateSequence((new Date(year, (month)%12, 0)).getDate()),
          this._generateSequence((new Date(month + 1 > 11 ? ++year : year, (month+1)%12, 0)).getDate()),
          this._generateSequence((new Date(month + 2 > 11 ? ++year : year, (month+2)%12, 0)).getDate())
        ];
      };

      Calendar.prototype._generateSequence = function(length) {
        var array = [];
        for(var i = 1; i <= length; i++){
            array.push(i)
        }
        return array;
      };

      Calendar.prototype._getFirstDayOfMonth = function(year, month) {
        return new Date(year, month).getDay();
      };

      Calendar.prototype.getCurrentMatrix = function(){
        var result = [];
        this.days = this._dateOfThreeMonth(this.year, this.month);
        this.firstDayOfMonth = this._getFirstDayOfMonth(this.year, this.month);
        if (this.firstDayOfMonth) {
            result = result.concat(this.days[0].slice(-this.firstDayOfMonth))
        }
        result = result.concat(this.days[1]);
        var restSize = this.matrixSize - result.length;
        if (restSize) {
            result = result.concat(this.days[2].slice(0, restSize))
        }
        return result;
      };

      Calendar.prototype.next = function(type) {
        var result = [];
        type || (type = 'month')

        if (type === 'year') {
            this.year++
        }
        if (type === 'month') {
            if (this.month <11) {
                this.month++;
            } else {
                this.year++
                this.month = 0
            }
        }
        result = this.getCurrentMatrix();
        this.showDate(result);
        this.showDateTitle();
      };

      Calendar.prototype.prev = function(type) {
        var result = []
        type || (type = 'month')

        if (type === 'year') {
            this.year--
        }
        if (type === 'month') {
            if (this.month >0) {
                this.month--
            } else {
                this.year--
                this.month = 11
            }
        }
        result = this.getCurrentMatrix();
        this.showDate(result);
        this.showDateTitle();
      };

      Calendar.prototype.reset = function() {
        var originDate = new Date(this.originTime);
        this.year = originDate.getFullYear();
        this.month = originDate.getMonth();
        this.day = originDate.getDay();
        var result = this.getCurrentMatrix();
      };
        
      Calendar.prototype._dateCreate = function(){
        var tbody = document.querySelector('tbody');
        while(tbody.hasChildNodes()){tbody.removeChild(tbody.firstChild)};
        for (var i = 0; i <= 5; i++) {
          var rowcount = i + 1;
          var row = tbody.insertRow(i);
          for (var j=0; j<=6 ; j++) {
            var cell = row.insertCell(j);
          }
        }
      };

      Calendar.prototype._dateDraw = function(res) {      
        var select = document.querySelector('#idCalendar').querySelectorAll('td');
        var dateArray = res || this.getCurrentMatrix();
        var changeColor = Array.prototype.filter.call(select,(function(v,i){return i < dateArray.indexOf(1) || i >= dateArray.lastIndexOf(1)}));
        for (var i=0,length = dateArray.length; i<length; i++){
          select[i].classList.remove('dateColor');
          select[i].innerHTML = dateArray[i];
        }
        for (var j=0,len=changeColor.length; j<len; j++){
          changeColor[j].classList.add('dateColor');
        }
      };

      Calendar.prototype.showDate = function (res){
        this._dateCreate();
        this._dateDraw(res);
      }

      Calendar.prototype.showDateTitle = function() {
        document.querySelector('#idCalendarMonth').innerHTML = this.month + 1;
        document.querySelector('#idCalendarYear').innerHTML = this.year;
      };

      Calendar.prototype.showCalendar = function(){
        var calendarHtml = this.button.parentElement.insertAdjacentHTML('beforeend','<div id="Calendar"><div id="idCalendarPreYear"><i class="fa fa-calendar-minus-o"></i></div><div id="idCalendarNextYear"><i class="fa fa-calendar-plus-o"></i></div><div id="idCalendarNextMonth"><i class="fa fa-calendar-plus-o fa-lg"></i></div><div id="idCalendarPreMonth"><i class="fa fa-calendar-minus-o fa-lg"></i></div><span id="idCalendarYear"></span>年<span id="idCalendarMonth"></span>月<table ><thead><tr><td>Sun</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td></tr></thead><tbody id="idCalendar"></tbody></table></div>');  
        this.showDate();
      };

      Calendar.prototype.bindEvent = function() {
        var that = this;
        document.querySelector('#idCalendarPreMonth').onclick = function (){that.prev();}
        document.querySelector('#idCalendarNextMonth').onclick = function (){that.next();}
        document.querySelector('#idCalendarPreYear').onclick = function (){that.prev('year');}
        document.querySelector('#idCalendarNextYear').onclick = function (){that.next('year');}
      };

      Calendar.prototype.clearCalendar = function() {
        if(document.querySelector('#Calendar')){
          var calParent = that.button.parentElement;
          calParent.removeChild(calParent.lastChild);
        }
      }

      return Calendar;
})()
var calendarBtn = document.querySelector('#calendarBtn'); 
var calendar = new Calendar(new Date().getTime(), calendarBtn);



