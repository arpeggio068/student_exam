//-------     Waiting/Loading Function                                 -------------// 
//----------------------------------------------------------------------------------//   
  function loadingStart(){
      document.getElementById("loading").classList.remove("invisible");
  }
       
  function loadingEnd(){
      document.getElementById("loading").classList.add("invisible");
  }

  function showSpin3(){
    document.getElementById('resp-spinner1').classList.remove("d-none");
    document.getElementById('resp-spinner2').classList.remove("d-none");
    document.getElementById('resp-spinner3').classList.remove("d-none");
  }

  function hideSpin3(){
    document.getElementById('resp-spinner1').classList.add("d-none");
    document.getElementById('resp-spinner2').classList.add("d-none");
    document.getElementById('resp-spinner3').classList.add("d-none");
  } 

  function showSpin5(){
    document.getElementById('resp-spinner5').classList.remove("d-none");
    document.getElementById('resp-spinner6').classList.remove("d-none");
    document.getElementById('resp-spinner7').classList.remove("d-none");
  }

  function hideSpin5(){
    document.getElementById('resp-spinner5').classList.add("d-none");
    document.getElementById('resp-spinner6').classList.add("d-none");
    document.getElementById('resp-spinner7').classList.add("d-none");
  }
//-------     Waiting/Loading Function                                 -------------// 
//----------------------------------------------------------------------------------// 


//-------     Utility Function                                         -------------// 
//----------------------------------------------------------------------------------// 
  function trim_text(el) {
    el.value = el.value.
    replace(/(^\s*)|(\s*$)/gi, ""). // removes leading and trailing spaces
    replace(/[ ]{2,}/gi, " "). // replaces multiple spaces with one space
    replace(/\n +/, "\n"); // Removes spaces after newlines
    return;
  }

  function letGoTrim(){
    $(function(){
      $("textarea").change(function(){
        trim_text(this);
      });

      $("input").change(function(){
        trim_text(this);
      });
    });
  }
//-------     Utility Function                                         -------------// 
//----------------------------------------------------------------------------------// 

  var arrayOfValues;
  var all_rec_student = [];
  var store = localforage.createInstance({
    name: "myDatabaseStudent11454"
  });   
  
  function listStudent(){ 
       
     const school = document.getElementById("school").value;
     const class_ = document.getElementById("class_").value;
     const room = document.getElementById("room").value;
     let filterArrayOfValues = []
     if(school !='' && class_ != ''){
       filterArrayOfValues = arrayOfValues.filter(function(r){return r['school'] === school
       && r['class_'] === class_ && r['room'] == room})
       .sort((a,b)=>{
         let c = Number(a['num'])
         let d = Number(b['num'])
         return c-d
       })        
       //list_filter = filterArrayOfValues      

     let result = `<table id="data-table" class="table table-striped table-bordered" style="width:100%">
       <thead>
        <tr>
          <th>ลำดับ</th>
          <th>ชื่อ-สกุล</th>
          <th>บันทึก</th>
        </tr>
       </thead>
     
     `
     filterArrayOfValues.forEach((r,i)=>{
        let clr1 = "black"
        const pcaries = Number(r['pcaries']) // เป็น number อยู่แล้ว

        if (pcaries > 0) {
          clr1 = "red";
        } else if (pcaries === 0 && r['pcaries'] !== '') {
          clr1 = "#3CAF05;";
        }

        result+= `<tr id="${"trId"+i}">
        <td style="color:${clr1};"><input type="hidden" id="${"inputId"+i}" value="${r['id']}">${r['num']}</td>
        <td style="color:${clr1};">${r['name']}</td>
        <td><p style="color:blue" type="button" onclick = "setRec(${i})">บันทึก</p></td>
        </tr>`
       
     })

      result+='</table>'

      $('#table_app').html(result)     
      
    }
    else{
      Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "โปรดเลือกโรงเรียนและระดับชั้น",
                     timer:2000
                     
                })      
    }
    
  }

  async function checkExpired(item_name) {
    try {
      const lUserData = await store.getItem(item_name);
      const init = lUserData || null;
      const now = Date.now();
      const numDays = 1 * 24 * 60 * 60 * 1000; // 1 day
      // const numDays = 5 * 60 * 1000; // 5 min

      if (!init || !init.timestamp || (now - init.timestamp > numDays)) {
        $('#school').html('');
        $('#class_').html('');
        $('#room').html('');
        $('#table_app').html('');
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn("error on checkExpired function:", err);
      // ล้าง UI เผื่อข้อมูลผิดพลาดจริง
      $('#school').html('');
      $('#class_').html('');
      $('#room').html('');
      $('#table_app').html('');
      return true; // ให้ถือว่า expired ไปเลยเพื่อความปลอดภัย
    }
  }

  async function beforeSetTable(){
    try {
      const check = await checkExpired("student_data")
      if(check){
        await store.removeItem("student_data")
        Swal.fire({
            icon: 'warning',
            text: 'ข้อมูลหมดอายุ กรุณาโหลดใหม่',
            showConfirmButton: true,
            timer: 5000
        });
      } else {
        setTable()
      }
    } catch (err) {
      console.error("problem of local cache :", err);
      // ไม่แสดง Swal ซ้ำ เพราะผู้ใช้ต้องโหลดใหม่อยู่ดี
    }
  }


  function setTable(){
     document.getElementById("showBtn").disabled = true;
     listStudent()
     
     setTimeout(function(){
      $('#data-table').DataTable({        
          columnDefs: [
            {
              targets: 0, // คอลัมน์ "ลำดับ"
              render: function (data, type, row) {
                // ให้แปลงค่าก่อน sort เป็นตัวเลข
                return type === 'sort' ? parseInt(data, 10) : data;
              }
            }
          ],
          order: [[0, 'asc']], // เรียงจากน้อยไปมาก
          lengthMenu: [[100, 50, 25,10], [100, 50, 25, 10]]
      });
     },20)
     document.getElementById("showBtn").disabled = false; 
  }

  async function clearSchoolData() {
    if (confirm("ระบบจะล้างข้อมูลนักเรียนในหน่วยความจำ\nยกเว้นข้อมูลที่รออัพโหลด!")) {
      try {
        await store.removeItem("student_data");
        console.log("Main student Data removed successfully");
        // ล้าง UI
        $('#school').html('');
        $('#class_').html('');
        $('#room').html('');
        $('#table_app').html('');
      } catch (error) {
        console.warn("error on remove Main student data: ", error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถล้างข้อมูลได้ กรุณาลองใหม่',
        });
      }
    }
  }


  function loadAlert(){
    let txt;
    if (confirm("กด ตกลง เพื่อยืนยันการดาวน์โหลดข้อมูล!")) {
      txt = "OK!";
      loadingStart();
      studentLoad()
    } else {
      txt = "Cancel!";
    }
    //document.getElementById("demo").innerHTML = txt;
  }

  async function upLoad() {    
    try {
      const all = await store.getItem("all_rec_student");
      console.log("all_rec_student retrieved successfully");

      const obj = all ? JSON.parse(all) : null;

      if (!obj) {
        alert("ไม่มีข้อมูลให้อัพโหลด");
        return;
      }

      if (confirm("กด ตกลง เพื่อยืนยันการอัพโหลดข้อมูล!")) {
        loadingStart();
        await saveRecord(obj);
      }
    } catch (error) {
      console.error("Error while retrieving or parsing all_rec_student:", error);
      alert("เกิดข้อผิดพลาดระหว่างโหลดข้อมูลจากอุปกรณ์\nกรุณาลองใหม่");
    }

  } 

//--------------   server api -----------------------------------------------------------------------------------------
//--------------   server api -----------------------------------------------------------------------------------------

  const mainUrl = 'https://script.google.com/macros/s/AKfycbwJGTbmZZsLw6mzFqEXlx0Qg7RiorZsxO87pQhJxm_gbU_WE4bsW0Twq66P0vAgSZYuaA/exec' 
  
  async function saveRecord(obj){  
        const obj_json = JSON.stringify({obj:obj,id:gId})        
        let formData = new FormData();
        formData.append('action', 'saveRecord');            
        formData.append('data', obj_json);

        try {
            const response = await fetch(mainUrl, {
                method: 'POST',
                redirect: "follow",
                mode: 'cors',
                body: formData,
            });
            const data = await response.json();
            console.log(data.message)

            if (data.status === "success") {
                await store.removeItem("all_rec_student").then(function() {
                      console.log("Data removed successfully");
                    }).catch(function(error) {
                      console.log("Error while removing data: " + error);
                    });
                $('#val_total').text("  0");
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    text: 'อัพโหลดข้อมูลสำเร็จ!',
                    showConfirmButton: true,
                    timer: 3000
                });              

            }
            else{
              await store.removeItem("student_data")
              Swal.fire({
                position: 'center',
                icon: 'warning',
                text: 'ลิงก์หมดอายุหรือไม่ถูกต้อง',
                showConfirmButton: true
              });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                text: 'เกิดข้อผิดพลาด โปรดตรวจสอบการเชื่อมต่ออินเตอร์เนต',
                showConfirmButton: true,
                timer: 5000
            });
        } finally {
           loadingEnd()           
           console.log('end load');
        }
  }

  async function studentLoad() {       
        const obj_json = JSON.stringify({id:gId})
        //console.log("gId: ",gId)
        let formData = new FormData();
        formData.append('action', 'studentLoad');       
        formData.append('data', obj_json);

        try {
            const response = await fetch(mainUrl, {
                method: 'POST',
                redirect: "follow",
                mode: 'cors',
                body: formData,
            });
            const data = await response.json();
            console.log(data.message)

            if (data.status === "success") {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    text: 'โหลดข้อมูลสำเร็จ!',
                    showConfirmButton: true,
                    timer: 3000
                });
                
                const arrayofArrays = data.student //json data
                //console.log(arrayofArrays)
                await afterDropdownArrayReturned(arrayofArrays)                
                console.log("save student data")        

            }
            else{
              await store.removeItem("student_data")
              Swal.fire({
                position: 'center',
                icon: 'warning',
                text: 'ลิงก์หมดอายุหรือไม่ถูกต้อง',
                showConfirmButton: true
              });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                text: 'เกิดข้อผิดพลาด โปรดตรวจสอบการเชื่อมต่ออินเตอร์เนต',
                showConfirmButton: true,
                timer: 5000
            });
        } finally {
           loadingEnd()           
           console.log('end load');
        }
  }  

  async function offlineArrayReturned() {
    try {
      const check = await checkExpired("student_data")
      if(check){
        await store.removeItem("student_data")
        Swal.fire({
                position: 'center',
                icon: 'warning',
                text: 'ข้อมูลหมดอายุ กรุณาโหลดใหม่',
                showConfirmButton: true,
                //timer: 5000
            });
        return;
      }
      
      const lData = await store.getItem("student_data");
      console.log("Offline Data retrieved successfully");
      
      const init = lData ? JSON.parse(lData.arrayofArrays) : [];

      const school = document.getElementById("school");

      if (Array.isArray(init) && init.length > 0) {
        arrayOfValues = init.filter(() => true);  // or keep original filter logic
        addUniqueOptionsToDropdownList(school, arrayOfValues, 'school');
        afterFirstDropdownChanged();
        afterSecondDropdownChanged();
      }

    } catch (error) {
      console.log("Error while retrieving offline data: " + error);
    } finally {
      //loadingEnd();
      console.log("end off line data loaded") 
    }
  }


  async function afterDropdownArrayReturned(arrayofArrays) {
    try {
      // Save data
      const obj_offline = {
        arrayofArrays:arrayofArrays, // arrayofArrays is json string
        timestamp: Date.now()

      }
      await store.setItem("student_data", obj_offline);
      console.log("Loaded Data saved successfully");

      // Retrieve data
      const lData = await store.getItem("student_data");
      console.log("Student Data retrieved successfully");

      // Parse and use data
      arrayOfValues = JSON.parse(lData.arrayofArrays).filter(function(r){return true;});
      const school = document.getElementById("school");

      if (arrayOfValues) {
        addUniqueOptionsToDropdownList(school, arrayOfValues, 'school');
        afterFirstDropdownChanged();
        afterSecondDropdownChanged();
      }

      // Success message
      Swal.fire({
        position: 'center',
        icon: 'success',
        text: "ดาวน์โหลดสำเร็จ",
        timer: 2000
      });

      $('#table_app').html('');
    } catch (error) {
      console.error("Error in afterDropdownArrayReturned:", error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดข้อมูลได้',
      });
    } finally {
      loadingEnd();
    }
  }

  function afterFirstDropdownChanged(){     
     const class_ = document.getElementById("class_");
     const school = document.getElementById("school").value;
     const filterArrayOfValues = arrayOfValues.filter(function(r){return r['school'] === school});
     addUniqueOptionsToDropdownList(class_,filterArrayOfValues,'class_'); 
     afterSecondDropdownChanged();
  }

 function afterSecondDropdownChanged(){
     const room = document.getElementById("room");
     const school = document.getElementById("school").value;
     const class_ = document.getElementById("class_").value;
     const filterArrayOfValues = arrayOfValues.filter(function(r){return r['school'] === school && r['class_'] === class_ });
     addUniqueOptionsToDropdownList(room,filterArrayOfValues,'room');   
  } 

  function addUniqueOptionsToDropdownList(el,arrayofArrays,obj){    
    let currentlyAdded = [];
    el.innerHTML = '';
    arrayofArrays.forEach(function(r){
      if(currentlyAdded.indexOf(r[obj])=== -1){
        let option = document.createElement("option"); 
        option.textContent = r[obj];
        el.appendChild(option);
        currentlyAdded.push(r[obj]);
       }
     });  
  }

  async function callOffLineData(){
    try{
        await offlineArrayReturned();        
        const all = await store.getItem("all_rec_student");
        console.log("all_rec_student retrieved successfully");
       
        all_rec_student = [];
        if (all) {
          try {
            const parsed = JSON.parse(all);
            if (Array.isArray(parsed)) {
              all_rec_student = parsed;
            } else {
              console.warn("all_rec_student is not an array");
            }
          } catch (e) {
            console.warn("Invalid JSON in all_rec_student:", e);
          }
        }
        // แสดงผลจำนวน
        $('#val_total').text(" " + all_rec_student.length)
      }
      catch (error){
        Swal.fire({
          position: 'center',
          icon: 'error',
          text: 'เกิดข้อผิดพลาดในการเรียกข้อมูล off line โปรดลองใหม่อีกครั้ง',
          showConfirmButton: true
        });
        console.error("Fetch Error:", error.message);
      }
      finally {
       loadingEnd(); 
      }
  }

  async function getDataAPI(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        // headers: { 'Content-Type': 'application/json' } // ไม่จำเป็นสำหรับ GET ถ้าไม่มี body
      });

      const data = await response.json();

      if (data.data && data.data.length > 0) {
        gData = data.data;
        gId = gData[0];
        //console.log("Token OK:", gId);
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: 'ลิงก์ web ถูกต้อง',
          showConfirmButton: true,
          timer: 3000
        });

        await callOffLineData()
        
      } else {
        gId = ''
        Swal.fire({
          position: 'center',
          icon: 'warning',
          text: 'ลิงก์หมดอายุหรือไม่ถูกต้อง',
          showConfirmButton: true
        });

        console.warn('Token not found or expired');
        await store.removeItem('student_data');

        // ถ้าต้องการ redirect
        // setTimeout(() => window.location.href = "/", 5000);
      }
    } catch (error) {
      // ดักจับ error fetch หรือ JSON parse
      Swal.fire({
        position: 'center',
        icon: 'error',
        text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ โปรดลองใหม่อีกครั้ง',
        showConfirmButton: true
      });
      console.error("Fetch Error:", error.message);
    } finally {
      loadingEnd(); 
    }
  }


//--------------   server api -----------------------------------------------------------------------------------------
//--------------   server api -----------------------------------------------------------------------------------------
  

  function preventFormSubmit(){
      const forms = document.querySelectorAll('form');
      for (let i = 0; i < forms.length; i++) {
           forms[i].addEventListener('submit', function(event) {
              event.preventDefault();
           });
      }
  }

  $.extend(true, $.fn.dataTable.defaults, {
    "language": {
              "sProcessing": "กำลังดำเนินการ...",
              "sLengthMenu": "แสดง _MENU_ แถว",
              "sZeroRecords": "ไม่พบข้อมูล",
              "sInfo": "แสดง _START_ ถึง _END_ จาก _TOTAL_ แถว",
              "sInfoEmpty": "แสดง 0 ถึง 0 จาก 0 แถว",
              "sInfoFiltered": "(กรองข้อมูล _MAX_ ทุกแถว)",
              "sInfoPostFix": "",
              "sSearch": "ค้นหา:",
              "sUrl": "",
              "oPaginate": {
                            "sFirst": "เริ่มต้น",
                            "sPrevious": "ก่อนหน้า",
                            "sNext": "ถัดไป",
                            "sLast": "สุดท้าย"
              }
     }
  }); 

  let gUrl, gId, gData;

  /*document.addEventListener("DOMContentLoaded", async function () {
    try {
      loadingStart()    
      
      console.log("start");     
     
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");

      if (id) {                   
         gUrl = mainUrl+'?id='+id         
         await getDataAPI(gUrl)         
         console.log("ID:", id);
      } else {
         loadingEnd()
         console.log("No ID found in URL.");
      }
      
      letGoTrim();
      preventFormSubmit()
    } catch (error) {
      console.error("Unexpected error in DOMContentLoaded:", error);
    }
  });*/
  

  document.addEventListener("DOMContentLoaded", async function () {
    try {
      loadingStart();
      console.log("start");

      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      //console.log("ID:", id);
      if (!id) {
        loadingEnd();
        console.log("No ID found in URL.");
        return;
      }
      
      gUrl = mainUrl + '?id=' + id;

      const LOADED_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 ชั่วโมง
      const stored_exp = await store.getItem('loaded:' + id);
      const now = Date.now();

      if (stored_exp && stored_exp.dataLoaded && now - stored_exp.timestamp < LOADED_EXPIRY_MS) {
        console.log("✅ dom loaded not expired use localforage");
        gId = id
        await callOffLineData()
      } else {
        console.log("⏰ dom loaded expired check API");
        await getDataAPI(gUrl);
        await store.setItem('loaded:' + id, {
          timestamp: now,
          dataLoaded: true
        });
      }

    } catch (error) {
      console.error("Unexpected error in DOMContentLoaded:", error);
    } finally {
      letGoTrim();
      preventFormSubmit();
    }
  });
  

  window.onbeforeunload = function(event) {    
    event.preventDefault();
    event.returnValue = ''; // จำเป็นสำหรับบางเบราว์เซอร์ (เช่น Chrome) 
      //return confirm('Confirm refresh');
  };

  

