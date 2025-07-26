function form2PrvBtn(){
     $('#form1').show()
     $('#form2').hide()
  }

  function showNeed_pfilling(){
     const pcaries = $('#pcaries').val()
     if(Number(pcaries) > 0){
       $('#showNeed_pfilling').show()
     }
     else{
       $('#showNeed_pfilling').hide()
     }
  }

  function showNeed_sealant(){
     const pteeth = $('#pteeth').val()
     if(Number(pteeth) > 0){
       $('#showNeed_sealant').show()
     }
     else{
       $('#showNeed_sealant').hide()
     }

  }

  function beforeSubmit(){
    document.getElementById("save_btn").disabled = true; 
    if(validateForm2()){
      if(checkForm2()){
         submitRec()         
      }
    }
    
    document.getElementById("save_btn").disabled = false;
  }

  async function submitRec(){      
    const currDate = new Date().getFullYear()+"/" +(new Date().getMonth() +1) +"/"+new Date().getDate()  
    let rec = {}
    rec['date'] = currDate
    rec['id'] = $('#id_main').val()
    rec['num'] = $('#num').val()
    rec['name'] = $('#name').val()
    rec['school'] = $('#form_school').val()
    rec['class_'] = $('#form_class').val()
    rec['room'] = $('#form_room').val()
    rec['dteeth'] = Number($('#dteeth').val())
    rec['dcaries'] = Number($('#dcaries').val())    

    let need_dfilling = [] // จัดการตัวเลือกแบบ checkbox
    $('input[name="need_dfilling"]:checked').each((i,ele)=>{need_dfilling.push($(ele).val())})
    rec['need_dfilling'] = need_dfilling.join(' ')

    let need_dextract = [] // จัดการตัวเลือกแบบ checkbox
    $('input[name="need_dextract"]:checked').each((i,ele)=>{need_dextract.push($(ele).val())})
    rec['need_dextract'] = need_dextract.join(' ')

    rec['dextract'] = $('#dextract').val()
    rec['dfilling'] = $('#dfilling').val()

    rec['pteeth'] = Number($('#pteeth').val())
    rec['pcaries'] = Number($('#pcaries').val())

    let need_pfilling = [] // จัดการตัวเลือกแบบ checkbox
    $('input[name="need_pfilling"]:checked').each((i,ele)=>{need_pfilling.push($(ele).val())})
    rec['need_pfilling'] = need_pfilling.join(' ')

    rec['need_pextract'] = $('#need_pextract').val()
    rec['pextract'] = $('#pextract').val()
    rec['pfilling'] = $('#pfilling').val()

    let need_sealant = [] // จัดการตัวเลือกแบบ checkbox
    $('input[name="need_sealant"]:checked').each((i,ele)=>{need_sealant.push($(ele).val())})
    rec['need_sealant'] = need_sealant.join(' ')

    rec['need_scaling'] = $('#need_scaling').val()
    rec['etc'] = $('#etc').val()
    rec['dentist'] = $('#dentist').val()

    const all = await store.getItem("all_rec_student").then(function(value) {
        console.log("all_rec_student retrieved successfully");
        return value
    }).catch(function(error) {
        console.log("Error while retrieving all_rec_student: " + error);
    });
    
    all_rec_student = await JSON.parse(all)    
    if(all_rec_student == null || all_rec_student == 'undefined'){
      all_rec_student = []
    }

    const indx = all_rec_student.findIndex(r => r['id'] === rec['id']);
    all_rec_student.splice(indx, indx >= 0 ? 1 : 0);
    all_rec_student.push(rec);

    if(arrayOfValues != null){
      const indx_main = arrayOfValues.findIndex(r => r['id'] === rec['id']);
      arrayOfValues.splice(indx_main, indx_main >= 0 ? 1 : 0);
      arrayOfValues.push(rec);
    }
    
    await store.setItem("student_data", JSON.stringify(arrayOfValues)).then(function() {
       console.log("New Data saved successfully");       
    }).catch(function(error) {
       console.log("Error while saving new data: " + error);
    });   
    
    await store.setItem("all_rec_student", JSON.stringify(all_rec_student)).then(function() {
       console.log("New Data for upload saved successfully");       
    }).catch(function(error) {
       console.log("Error while saving new data for upload: " + error);
    });     

    $('#val_total').text("  "+all_rec_student.length); 
    
    $('#form2').hide()
    $('#main_select').show()
    $('#table_app').show()
     
     setTable()       
     removeValidate()
  }

  function removeValidate(){
    const form1 = document.querySelectorAll(".needs-validation1")    
     Array.prototype.slice.call(form1).forEach(function(form){ 
        form.classList.remove('was-validated')              
     })
    const form2 = document.querySelectorAll(".needs-validation2")    
     Array.prototype.slice.call(form2).forEach(function(form){ 
          form.classList.remove('was-validated')              
     })        
  }