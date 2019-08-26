// BUDGET Controller
var budgetController = (function() {
    

        var Expense = function(id,description,value){
            
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
            
        };
        
        Expense.prototype.calcPercentage = function(totalInc){
            
            if(totalInc > 0){
                this.percentage = Math.round(this.value / totalInc * 100);
            }
            else{
                this.percentage = -1;
            }

            
        };
    
        Expense.prototype.getPercentage = function(){
            
            return this.percentage;
        };
    
        var Income = function(id,description,value){
            
            this.id = id;
            this.description = description;
            this.value = value;
            
        };
    
    //this function calculates totals for either the expense or income
    var calculateTotal = function(type){
        
        var sum = 0;
        
        data.allItems[type].forEach(function(current){
            
            sum = sum + current.value;
            
        });
        data.totals[type] = sum;
        
        
    };
    
        
        var data = {
            
            allItems: {
                
                exp: [],
                inc: []
            },
            
            totals: {
            
                exp: 0,
                inc: 0
            },
            
            budget: 0,
            percentage: -1
            
        };

        return {
            
            //adds items to our expense or budget list
            addItem: function(type, des, val){
                
                var newItem, ID;
                
                //Creating new ID
                if(data.allItems[type].length > 0)
                    {
                        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                    }
                else
                    {
                        ID = 0;
                    }

                //Creating new expense or income type
                if(type === 'exp')
                    {
                         newItem = new Expense(ID, des, val);
                    }
                else if( type === 'inc')
                    {
                        newItem = new Income(ID, des, val);
                    }
                
                
                //put into our structure
                data.allItems[type].push(newItem);
                
                
                return newItem;
               
            },
            
            
            //deletes items from our array
            deleteItem: function(type, id) {
            var ids, index;
   
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
            },
            
            calculateBudget: function(){
                
                
                //calculates total income
                calculateTotal('exp');
                calculateTotal('inc');
                
                
                //calculates budget
                data.budget = data.totals.inc - data.totals.exp;
                
                
                //calculates the percentage
                if(data.totals.inc > 0)
                {
                        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                }
                else
                {
                        data.percentage = -1;
                }
                
            },
            
            //calculates all of the percentages
            calculatePercentages: function(){
                
                data.allItems.exp.forEach(function(current){
                    
                    current.calcPercentage(data.totals.inc);
                });
                
            },
            
            //gets the percentages
            getPercentages: function(){
                
                var allPercentages = data.allItems.exp.map(function(current){
                   
                    return current.getPercentage();
                    
                });
                return allPercentages
            },
            
            getBudget : function(){
                
                return{
                    
                    budget: data.budget,
                    totalInc: data.totals.inc,
                    totalExp: data.totals.exp,
                    percentage: data.percentage,
                };
                
            },
            
            testing: function(){
                
                console.log(data);
            }
        }
})();


//UI Controller
var UIController = (function () {
    
   
    
    
    //shortcut for css variables
    var DOMstrings = {
        
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        containter: '.container',
        expPercentageLabel: '.item__percentage',
        monthLabel: '.budget__title--month'
        
    };
     var formatNumber = function(num, type){
            var numSplit, int, dec, type;
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            
            int = numSplit[0];
            //if the number exceeds 3 digits, we add the comma if
            if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
            
        };
    
    
        var nodeList = function(list, callback){
                
              for(var i = 0; i < list.length; i++){
                  
                  callback(list[i],i);
              }  
            };
    
        
    return {
        
        
        getInput: function(){//receives input data from user
            return{
            type : document.querySelector(DOMstrings.inputType).value,
            description : document.querySelector(DOMstrings.inputDescription).value,
            value : parseFloat(document.querySelector(DOMstrings.inputValue).value),
            };
        },
        
        addListItem: function(obj, type){
            
            var html,newHtml,element;
            //create html string with placeholder text
            
           if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            
            //replaces placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));
            

            //inserts HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
            
        },
        
        
        deleteListItem: function(selectorID){
            
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
            
        },
        
        clearFields: function(){
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
                
            });
            
            fieldsArr[0].focus();
        },
        
        
        displayFields: function(obj){
            var type;
            
            obj.budget > 0 ? type = 'inc' : type = 'exp'; 
            
            //displays budget to UI
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if(obj.percentage > 0)
               {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
               }
            else
                {
                    document.querySelector(DOMstrings.percentageLabel).textContent = '---';
                }
            
            
            
        },
        
        //updates percentages for the UI
        displayPercentage: function(percentages){
            
            var fields = document.querySelectorAll(DOMstrings.expPercentageLabel);
            
            
            
            nodeList(fields, function(current, index){
                
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }
                else{
                    current.textContent = '---';
                    
                }
                
            });
            
        },
        
        displayMonth: function(){
            
            var now, month, year, months;
            
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            
            document.querySelector(DOMstrings.monthLabel).textContent = months[month] + ' ' +year;
            
        },
        
        
        //changes expenses to red
        changedType: function(){
            
            var fields = document.querySelectorAll(
            
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
            
             nodeList(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMstrings.inputType).classList.toggle('red');
            
        },
       
        
        getDOMStrings: function(){//returns the DOMStrings object to access variables
            
            return DOMstrings;
        }
    };
    
    
})();


// Global App Controller
var controller = (function(budgetCtrl,UICtrl){
    
    
     //sets up event listeners
    var SetupEventListeners = function(){
        
        var DOM = UICtrl.getDOMStrings();//gets DOMStrings from UIController
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13)
            {
                ctrlAddItem();
            }
        });
        
        document.querySelector(DOM.containter).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };
    
    
    var updateBudget = function(){
        
        
        //calculates the budget
        budgetCtrl.calculateBudget();
        
        
        
        //displays budget to UI
        var budget = budgetCtrl.getBudget();
        
        
        console.log(budget);
        //  Display budget on the UI
        UICtrl.displayFields(budget);
        
        
    };
    
    var updatePercentages = function(){
        
        
        // calculates percentages
        budgetCtrl.calculatePercentages();
        
        
        //reads percentages from budget control
        var percentages = budgetCtrl.getPercentages();
        
        
        //updates to UI
        console.log(percentages);
        UICtrl.displayPercentage(percentages);
    };
    
    var ctrlAddItem = function(){
        
        var input,newItem;
        // Get the field input data
        input = UICtrl.getInput();
    
        if(input.description !== "" && !isNaN(input.value) && input.value > 0)
            {
                 // Add the item to the budget controller
                newItem = budgetCtrl.addItem(input.type,input.description,input.value);
        
                // Add item to the UI
                UICtrl.addListItem(newItem,input.type);
        
                //clears all fields
                UICtrl.clearFields();
        
                // Calculate the budget and percentages
                updateBudget();
                updatePercentages();
            }
       
        
        
    };
    
    var ctrlDeleteItem = function(event){
        var itemID,splitID,type,ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        
        //splits the ID's
        if(itemID)
            {
                splitID = itemID.split('-');
                type = splitID[0];
                ID = parseInt(splitID[1]);
            }
        
        //deletes item from array
        budgetCtrl.deleteItem(type, ID);
        
        
        //deletes item from UI
        UICtrl.deleteListItem(itemID);
        
        
        //updates new budget and percentages
        updateBudget();
        updatePercentages();
        
    };
    
    
    return {
        
        init: function(){
            
            console.log('Application has started');
            UICtrl.displayMonth();
            UICtrl.displayFields({
                
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1 
                
            });

            SetupEventListeners();
        }
    }
  
        
    
    
})(budgetController,UIController);


//initializes the application
controller.init();