function setRec(row_number){
    const fields_need_dfilling = document.querySelectorAll('input[name="need_dfilling"]');
    const fields_need_dextract = document.querySelectorAll('input[name="need_dextract"]');
    const fields_need_pfilling = document.querySelectorAll('input[name="need_pfilling"]');
    const fields_need_sealant = document.querySelectorAll('input[name="need_sealant"]');    
      
      Array.prototype.forEach.call(fields_need_dfilling,function(el){               
            el.checked = false;            
      });
      
      Array.prototype.forEach.call(fields_need_dextract,function(el){               
            el.checked = false;            
      });
      
      Array.prototype.forEach.call(fields_need_pfilling,function(el){               
            el.checked = false;            
      });
       
      Array.prototype.forEach.call(fields_need_sealant,function(el){               
            el.checked = false;           
      });   
    
    const id = document.getElementById("inputId"+row_number).value    
    const rec = arrayOfValues.filter(function(r){return r['id'] === id})[0];     
    //console.log(rec)
    $('#id_main').val(rec['id'])
    $('#num').val(rec['num'])
    $('#name').val(rec['name'])
    $('#form_school').val(rec['school'])
    $('#form_class').val(rec['class_'])
    $('#form_room').val(rec['room'])
    $('#dteeth').val(rec['dteeth'])
    $('#dcaries').val(rec['dcaries'])
    //console.log('dextract=',rec['dextract'])
    if(rec['dextract'] != ''){
      $('#dextract').val(rec['dextract'])
    }
    else{
      $('#dextract').val(0)
    }

    if(rec['dfilling'] != ''){
      $('#dfilling').val(rec['dfilling'])
    }
    else{
      $('#dfilling').val(0)
    }

    $('#pteeth').val(rec['pteeth'])
    $('#pcaries').val(rec['pcaries'])
    $('#need_pextract').val(rec['need_pextract'])
    if(rec['pextract'] != ''){
      $('#pextract').val(rec['pextract'])
    }
    else{
      $('#pextract').val(0)
    }

    if(rec['pfilling'] != ''){
      $('#pfilling').val(rec['pfilling'])
    }
    else{
       $('#pfilling').val(0)
    }

    const need_scaling = rec['need_scaling'] == '' ? "0" : rec['need_scaling']
    $('#need_scaling').val(need_scaling)

    $('#etc').val(rec['etc'])
    $('#dentist').val(rec['dentist'])

    const need_dfilling = rec['need_dfilling'].split(' ')    
    //console.log(rec['need_dfilling'])    
    if(need_dfilling[0] != ""){
            Array.prototype.forEach.call(fields_need_dfilling,function(el){
              need_dfilling.forEach(r =>{
                if(el.value.includes(r)){
                    el.checked = "checked";
                } 
              })        
            }); 
    }

    const need_dextract = rec['need_dextract'].split(' ')
    if(need_dextract[0] != ""){
            Array.prototype.forEach.call(fields_need_dextract,function(el){
              need_dextract.forEach(r =>{
                if(el.value.includes(r)){
                    el.checked = "checked";
                } 
              })        
            }); 
    }

    const need_pfilling = rec['need_pfilling'].split(' ')
    if(need_pfilling[0] != ""){
            Array.prototype.forEach.call(fields_need_pfilling,function(el){
              need_pfilling.forEach(r =>{
                if(el.value.includes(r)){
                    el.checked = "checked";
                } 
              })        
            }); 
    }

    const need_sealant = rec['need_sealant'].split(' ')
    if(need_sealant[0] != ""){
            Array.prototype.forEach.call(fields_need_sealant,function(el){
              need_sealant.forEach(r =>{
                if(el.value.includes(r)){
                    el.checked = "checked";
                } 
              })        
            }); 
    }
   
    $('#main_select').hide() //main_select
    $('#table_app').hide() //main_select
    $('#form1').show()
    showNeed_dfilling()
    showNeed_dextract()
    showNeed_pfilling()
    showNeed_sealant()
    letGoTrim()
    preventFormSubmit()
  }//end setRec

  function showNeed_dfilling(){
     const dcaries = $('#dcaries').val()
     if(Number(dcaries) > 0){
       $('#showNeed_dfilling').show()
     }
     else{
       $('#showNeed_dfilling').hide()
     }

  }

  function showNeed_dextract(){
     const dteeth = $('#dteeth').val()
     if(Number(dteeth) > 0){
       $('#showNeed_dextract').show()
     }
     else{
       $('#showNeed_dextract').hide()
     }

  }

  function form1PrvBtn(){
    Swal.fire({
            position: 'center',
            title: 'คุณยังไม่ได้บันทึกข้อมูล ต้องการออกใช่หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
          }).then((result) => {
             if(result.isConfirmed){                  
                removeValidate()
                $('#main_select').show()
                $('#table_app').show()
                $('#form1').hide()                    
                        
             }
          })//then

  }

  function form1NextBtn(){
    if(validateForm1()){
        if(checkForm1()){
          $('#form1').hide()
          $('#form2').show()
          const form2 = document.querySelectorAll(".needs-validation2")    
          Array.prototype.slice.call(form2).forEach(function(form){ 
             form.classList.remove('was-validated')              
          }) 
        }
      
    }
  }