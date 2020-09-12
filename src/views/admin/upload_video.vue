<template>
    <div style="width:60%" class="container">
        <div class="number">
            <label>رقم الدرس</label>
            <input v-model="number" class="form-control" type="number" min="1" placeholder="رقم الدرس"/>
        </div>
        <div class="desc">
            <label>عنوان الدرس</label>
            <input v-model="name" class="form-control" type="text" placeholder="عنوان الدرس"/>
        </div>
        
        <div class="stage">
            <label>المرحلة الدراسية</label>
            <select v-model="stage" class="form-control">
                <option value="one">الصف الأول الثانوي</option>
                <option value="two">الصف الثاني الثانوي</option>
                <option value="three">الصف الثالث الثانوي</option>
            </select>
        </div>
        <div class="explain">
            <label>الشرح</label>
            <textarea v-model="explain" class="form-control" type="text" >الشرح</textarea>
        </div>
        <br><br>
        <div class="explain">
            <label>ارفع ملف الملحقات مضغوط</label>
            <input @change="getFile" type="file" style="display:none" ref="file"/>
            <img 
                style="cursor:pointer"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAOVBMVEX///8AAAClpaWenp6ampqgoKCoqKitra339/eCgoKOjo7ExMQwMDDs7Ow1NTXNzc3e3t5ISEiSkpIFFcMNAAADS0lEQVR4nO3dbU/iQBSGYSpSEMGX/f8/djMRhNJ2OkdOn/ZM7vuTyZqHudIWN3F1NxsiY19LH2Du9s1+6SPMW9s0zcvSh5izXZPaLn2M+do2P70ufZC52jXXKr2KN2ClxG1zX4U3ahdYIfERWN2NuusBKyP2r2BlxGFgRc/iGLAa4tAzWNWNmgNWQRy/RSu5UaeA4YkdYPv70b6aG7XzDL5ufj/sygMTHx03YSXEnuJO+Hh5Q9a/TPfC7h+HJA5cpI4w/I06dBd2hcGJg6d/EIZ+Focvz6MwMHHkXaQnDHujjl2avjAocfTUA8KQxPEzDwkDPouZizIoDPelP3dJhoXBbtTsPTciDEXMn3VMGOhZnLgYo8IwxKn3jHFhkBt18kJkhCGI02fMCQMQC06YFa6e+F5wvrywS3yf76h/7FRwASaEHeJproP+ubvDjb7bTwk7xHmO+UQlj9D06XcrFp6mgQXCG3F9d+n1nSb3F5KS63O9Udf3TrP5+a5Em/uUojuwYGepzu2xPWc/o+wZm95Zb+t9F/EKYfwQxg9h/BDGD2H8EMYPYfwQxg9h/BDGb5XC6X+J3ul4yI0VCQ9H20s++324F9vLNR85Yonw8GF8xWd/cNoqbN6eFL5ZX1AuzJ3e9DkIEc4mrP45rP69dIGvh25Cj19JUiQsbO8u9PiNJJ5Ct4MhNIXQEkL9UAqhJYT6oRRCSwj1QymElhDqh1IILSHUD6UQWkKoH0ohtIRQP5RCaAmhfiiF0BJC/VAKoSWE+qEUQksI9UMphJYQ6odSCC0h1A+lEFpCqB9KIbSEUD+UQmgJoX4ohdASQv1QCqElhPqhFEJLCPVDKYSWEOqHUvULvy9b3w5b6xR+XrY+HbbWKbz84KfHj6OuVbg5t/+cfoPuWoV+IdQPeYdQP+QdQv2Qdwj1Q94h1A95h1A/5B1C/ZB3CPVD3iHUD3mHUD/kHUL9kHcI9UPeIdQPeYdQP+QdQv2Qdwj1Q94h1A95h1A/5B1C/ZB3CPVD3iHUD3mHUD/kHUL9kHcI9UPeIdQPeYdQP+QdQv2Qdwj1Q94h1A95h1A/5B1C/ZB3CPVD3iG0D7n88K5j/v+X7GpDiBDh8iFEiHD5poT/AZDtIkjSvJ7YAAAAAElFTkSuQmCC" 
                width="20px" height="20px" @click="$refs.file.click()"
            />
            <div>{{fileName}}</div>
        </div>
        <div style="margin-top:30px;">
            <input @change="getVideo" type="file" style="display:none" ref="vid"/>
            <img 
                style="cursor:pointer"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAOVBMVEX///8AAAClpaWenp6ampqgoKCoqKitra339/eCgoKOjo7ExMQwMDDs7Ow1NTXNzc3e3t5ISEiSkpIFFcMNAAADS0lEQVR4nO3dbU/iQBSGYSpSEMGX/f8/djMRhNJ2OkdOn/ZM7vuTyZqHudIWN3F1NxsiY19LH2Du9s1+6SPMW9s0zcvSh5izXZPaLn2M+do2P70ufZC52jXXKr2KN2ClxG1zX4U3ahdYIfERWN2NuusBKyP2r2BlxGFgRc/iGLAa4tAzWNWNmgNWQRy/RSu5UaeA4YkdYPv70b6aG7XzDL5ufj/sygMTHx03YSXEnuJO+Hh5Q9a/TPfC7h+HJA5cpI4w/I06dBd2hcGJg6d/EIZ+Focvz6MwMHHkXaQnDHujjl2avjAocfTUA8KQxPEzDwkDPouZizIoDPelP3dJhoXBbtTsPTciDEXMn3VMGOhZnLgYo8IwxKn3jHFhkBt18kJkhCGI02fMCQMQC06YFa6e+F5wvrywS3yf76h/7FRwASaEHeJproP+ubvDjb7bTwk7xHmO+UQlj9D06XcrFp6mgQXCG3F9d+n1nSb3F5KS63O9Udf3TrP5+a5Em/uUojuwYGepzu2xPWc/o+wZm95Zb+t9F/EKYfwQxg9h/BDGD2H8EMYPYfwQxg9h/BDGb5XC6X+J3ul4yI0VCQ9H20s++324F9vLNR85Yonw8GF8xWd/cNoqbN6eFL5ZX1AuzJ3e9DkIEc4mrP45rP69dIGvh25Cj19JUiQsbO8u9PiNJJ5Ct4MhNIXQEkL9UAqhJYT6oRRCSwj1QymElhDqh1IILSHUD6UQWkKoH0ohtIRQP5RCaAmhfiiF0BJC/VAKoSWE+qEUQksI9UMphJYQ6odSCC0h1A+lEFpCqB9KIbSEUD+UQmgJoX4ohdASQv1QCqElhPqhFEJLCPVDKYSWEOqHUvULvy9b3w5b6xR+XrY+HbbWKbz84KfHj6OuVbg5t/+cfoPuWoV+IdQPeYdQP+QdQv2Qdwj1Q94h1A95h1A/5B1C/ZB3CPVD3iHUD3mHUD/kHUL9kHcI9UPeIdQPeYdQP+QdQv2Qdwj1Q94h1A95h1A/5B1C/ZB3CPVD3iHUD3mHUD/kHUL9kHcI9UPeIdQPeYdQP+QdQv2Qdwj1Q94h1A95h1A/5B1C/ZB3CPVD3iG0D7n88K5j/v+X7GpDiBDh8iFEiHD5poT/AZDtIkjSvJ7YAAAAAElFTkSuQmCC" 
                width="70px" height="70px" @click="$refs.vid.click()"
            />
            <div>{{videoName}}</div>
            <div v-if="edit">
                <video controls>
                    <source :src="this.videoName" type="video/mp4"/>
                </video> 
            </div>
            <button style="margin-top:20px;" @click="uploadVideo" class="btn btn-danger">Upload video</button>
            <div>{{progress}}</div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    mounted() {
        const params = this.$route.params;
        if(params.id) {
            axios.get('/fetchVideo/'+params.id).then(res => {
                this.video = res.data.video.videoPath;
                this.videoName = res.data.video.videoPath;
                this.file = res.data.video.filePath;
                this.fileName = res.data.video.filePath;
                this.name = res.data.video.name;
                this.number = res.data.video.number;
                this.stage = res.data.video.stage;
                this.id = res.data.video._id;
                this.edit = true;
                this.explain = res.data.video.explain
                this.videoExist = true;
            })
        }
    },
    data() {
        return {
            edit: false,
            number: null,
            name: null,
            stage: null,
            explain: '',
            id: null,
            progress: '0%',
            video: null,
            videoName: '',
            videoExist: false,
            file: '',
            fileName: '',
            fileExist: false
        }
    },
    methods: {
        getVideo(event) {
            const file =  event.target.files[0];
            if(file.type !== 'video/mp4') {
                alert('صيغة الفيديو غير مسموح بيها');
                return;
            }
            if(file.size > 500*1000000) {
                alert('حجم الفيديو أكبر من المسموح به');
                return;
            }
            this.videoName = file.name;
            this.video = file;
            if(this.video.size > 0) this.videoExist = true;
        },
        getFile(event) {
            const file =  event.target.files[0];
            console.log(file);
            // if(file.type !== 'video/mp4') {
            //     alert('صيغة الفيديو غير مسموح بيها');
            //     return;
            // }
            if(file.size > 10000000) {
                alert('حجم الملف أكبر من المسموح به');
                return;
            }
            this.fileName = file.name;
            this.file = file;
            if(this.file.size > 0) this.fileExist = true;
        },
        uploadVideo() {
            if(this.name && this.number && this.stage && this.videoExist) {
                const formData = new FormData();
                formData.append('number', this.number);
                formData.append('name', this.name);
                formData.append('stage', this.stage);
                formData.append('video', this.video);
                formData.append('date', new Date());
                formData.append('file', this.file);
                formData.append('explain', this.explain);
                console.log(formData);
                let url = this.edit?'updateVideo/'+this.id:'uploadVideo';
                axios.post(url, formData, {
                    onUploadProgress: progress => {
                        this.progress = ((progress.loaded / progress.total)*100).toString()+'%';
                    }
                }).then(res => {
                    if(res.data.done) {
                        alert('تم رفع الفيديو بنجاح');
                    } else {
                        alert('حدثت مشكلة اثناء رفع الفيديو')
                    }
                })
            } else {
                alert('كمل بقيت البيانات وأرفع الفيديو')
            }
        }
    }
}
</script>