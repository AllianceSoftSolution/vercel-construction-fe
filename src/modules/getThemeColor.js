import { layoutColors } from "../config/colors"

export default (user,color) => {
    if(user=="HO"){
     return layoutColors.HospitalAdmin[color]
    }else if(user=="AG"){
      return layoutColors.SystemDashboard[color]
    } else if(user=="AD"){
      return layoutColors.AdminDashboard[color]
    }

    }