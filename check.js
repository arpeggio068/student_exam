function validateForm1(){
    const forms = document.querySelectorAll(".needs-validation1")
    
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

    return Array.prototype.every.call(forms,function(form){
        return form.checkValidity();
    });
  }

  function validateForm2(){
    const forms = document.querySelectorAll(".needs-validation2")
    
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

    return Array.prototype.every.call(forms,function(form){
        return form.checkValidity();
    });
  }

  function checkForm1(){
    const dteeth = $('#dteeth').val()
    const dcaries = $('#dcaries').val()
    const dextract = $('#dextract').val() 
    const dfilling = $('#dfilling').val()  
    let need_dfilling = [] // จัดการตัวเลือกแบบ checkbox
    $('input[name="need_dfilling"]:checked').each((i,ele)=>{need_dfilling.push($(ele).val())})    
    let need_dextract = [] // จัดการตัวเลือกแบบ checkbox
    $('input[name="need_dextract"]:checked').each((i,ele)=>{need_dextract.push($(ele).val())})

    let sw = true 
    switch(true){
       case Number(dcaries) > Number(dteeth) : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "จำนวนฟันน้ำนมผุ > จำนวนฟันน้ำนมทั้งหมด"
                     
                  })     
             
              sw = false;            
            break;
        case need_dfilling.length > Number(dcaries) : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "ฟันน้ำนมที่ต้องอุด > จำนวนฟันน้ำนมผุ"
                     
                  })        
             
              sw = false;            
            break;
        case need_dextract.length > Number(dteeth) : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "ฟันน้ำนมที่ต้องถอน > จำนวนฟันน้ำนมทั้งหมด"
                     
                  })        
             
              sw = false;            
            break;    
        case Number(dcaries) + Number(dfilling) > Number(dteeth) : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "ผลรวมตัวเลขฟันน้ำนม (ผุ + ได้อุด) > จำนวนฟันน้ำนมทั้งหมด"
                     
                  })        
             
              sw = false;            
            break;       
        case Number(dcaries) + Number(dextract) + Number(dfilling) > Number(dteeth) : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "ผลรวมตัวเลขฟันน้ำนม (ผุ + ได้อุด + ถูกถอน) > จำนวนฟันน้ำนมทั้งหมด"
                     
                  })        
             
              sw = false;            
            break;
        case Number(dteeth) + Number(dextract)  > 20 : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "ผลรวมตัวเลขฟันน้ำนม (ทั้งหมด + ถูกถอน) > 20"
                     
                  })        
             
              sw = false;            
            break;                       
    }
    return sw;
  }

 function isValidNeedPextractValue(value) {
  const pteeth_array = [
    "11","12","13","14","15","16","17",
    "21","22","23","24","25","26","27",
    "31","32","33","34","35","36","37",
    "41","42","43","44","45","46","47"
  ];

  const text = String(value || "").trim();

  // ค่าว่าง = ไม่ผิด
  if (text === "") {
    return true;
  }

  const arr = text.split(/\s+/);
  return arr.every(p => pteeth_array.includes(p));
}


function setNeedPextractInvalid(message) {
  const el = document.getElementById("need_pextract");
  if (!el) return;

  el.classList.add("is-invalid");
  el.classList.remove("is-valid");

  const feedback = el.parentElement.querySelector(".invalid-feedback");
  if (feedback) {
    feedback.textContent = message;
    feedback.style.display = "block";
  }
}


function clearNeedPextractInvalid() {
  const el = document.getElementById("need_pextract");
  if (!el) return;

  el.classList.remove("is-invalid");

  const feedback = el.parentElement.querySelector(".invalid-feedback");
  if (feedback) {
    feedback.style.display = "none";
  }
}


function setPextractEvent(val) {
  const value = String(val || "").trim();

  // ถ้าว่าง หรือรูปแบบถูกต้อง ให้ล้าง invalid feedback
  if (value === "" || isValidNeedPextractValue(value)) {
    clearNeedPextractInvalid();
    return;
  }

  // ถ้ายังพิมพ์ผิดอยู่ ให้แสดง feedback ต่อ
  setNeedPextractInvalid("ตัวอย่างเช่น 36 หรือ 11 36 46");
}  
  
 function checkForm2(){
     clearNeedPextractInvalid();     
     const dteeth = $('#dteeth').val()    
     const dextract = $('#dextract').val()
     const pteeth = $('#pteeth').val()
     const pcaries = $('#pcaries').val()
     const pextract = $('#pextract').val() 
     const pfilling = $('#pfilling').val()

     let need_pfilling = [] // จัดการตัวเลือกแบบ checkbox
     $('input[name="need_pfilling"]:checked').each((i,ele)=>{need_pfilling.push($(ele).val())})

     let need_sealant = []
     $('input[name="need_sealant"]:checked').each((i,ele)=>{need_sealant.push($(ele).val())})     
     
     const need_pextract_text = $('#need_pextract').val().trim();
     const need_pextract = need_pextract_text === "" ? [] : need_pextract_text.split(/\s+/);
     const error_pextract = isValidNeedPextractValue(need_pextract_text); 
     
     let sw = true 
     switch(true){
       case Number(pcaries) > Number(pteeth) : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "จำนวนฟันแท้ผุ > จำนวนฟันแท้ทั้งหมด"
                     
                  })        
             
              sw = false;            
            break;
        case need_sealant.length > Number(pteeth) : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "จำนวนฟันที่ต้องเคลือบหลุมร่องฟัน > จำนวนฟันแท้ทั้งหมด"
                     
                  })        
             
              sw = false;            
            break;    
        case need_pfilling.length > Number(pcaries) : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "ฟันแท้ที่ต้องอุด > จำนวนฟันแท้ผุ"
                     
                  })        
             
              sw = false;            
            break;
         case Number(dteeth) == 0 && Number(dextract) < 20 && Number(pteeth) == 0: 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "มีจำนวนฟันแท้ = 0 และ จำนวนฟันน้ำนม = 0"+
                     '\nให้ตรวจสอบจำนวนฟันน้ำนมทั้งหมดและจำนวนฟันแท้ทั้งหมดอีกครั้ง'                     
                     
                  })        
             
              sw = false;            
            break;
         case Number(pcaries) + Number(pfilling) > Number(pteeth) : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "ผลรวมตัวเลขฟันแท้ (ผุ + ได้อุด) > จำนวนฟันแท้ทั้งหมด"
                     
                  })        
             
              sw = false;            
            break;       
        case Number(pcaries) + Number(pextract) + Number(pfilling) > Number(pteeth) : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "ผลรวมตัวเลขฟันแท้ (ผุ + ได้อุด + ถูกถอน) > จำนวนฟันแท้ทั้งหมด"
                     
                  })        
             
              sw = false;            
            break;
        case Number(pteeth) + Number(pextract)  > 28 : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "ผลรวมตัวเลขฟันแท้ (ทั้งหมด + ถูกถอน) > 28"
                     
                  })        
             
              sw = false;            
            break;
         case Number(pcaries) > 0 && need_pfilling.length == 0 && need_pextract.length == 0 : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "มีฟันแท้ผุ โปรดบันทึกฟันแท้ที่ต้องอุดหรือต้องถอน"
                     
                  })        
             
              sw = false;            
            break;
         case error_pextract == false : 
            setNeedPextractInvalid(
                "ตัวอย่างเช่น 36 หรือ 11 36 46"
            );
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "รูปแบบการบันทึกฟันแท้ที่ต้องถอนไม่ถูกต้อง"+
                     '\nบันทึกรหัสฟันแล้วเว้นวรรค' +                    
                     '\nและตรวจสอบรหัสฟันให้ถูกต้อง'  
                  })        
             
              sw = false;            
            break;        
         case need_pfilling.length + need_pextract.length > Number(pcaries) && need_pextract.length > 0: 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "ฟันแท้ที่ต้องอุด/ถอน มากกว่าจำนวนฟันแท้ผุ"
                     
                  })        
             
              sw = false;            
            break;
         case Number(pteeth) == 0 && need_pextract.length > 0: 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "บันทึกข้อมูลฟันแท้ที่ต้องถอน แต่จำนวนฟันแท้ = 0"
                     
                  })        
             
              sw = false;            
            break;                                           
              
     }
     return sw;
  }